const axios = require("axios");
const Expense = require("../models/Expense");
const Income = require("../models/Income");

exports.handleChatbotMessage = async (req, res) => {
  const userId = req.user.id;
  const { message } = req.body;

  try {
    const expenses = await Expense.find({ userId });
    const incomes = await Income.find({ userId });

    const formattedExpenses = expenses.map(e =>
      `(${e.category}) $${e.amount} on ${new Date(e.date).toDateString()}`
    ).join("\n");

    const formattedIncomes = incomes.map(i =>
      `(${i.source}) $${i.amount} on ${new Date(i.date).toDateString()}`
    ).join("\n");

    const prompt = `
You are a friendly and professional personal financial advisor.

Here is the user's financial data:

Income:
${formattedIncomes}

Expenses:
${formattedExpenses}

The user asked: "${message}"
Respond clearly, concisely, and in a helpful tone.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });

  } catch (error) {
    console.error("❌ Groq Chatbot Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({ message: "Error processing your message with Groq." });
  }
};
