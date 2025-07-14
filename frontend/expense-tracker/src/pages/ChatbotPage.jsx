import React, { useState } from 'react';
import DashboardLayout from "../components/layouts/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [userMsg, setUserMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userMsg.trim()) return;

    const newMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(newMessages);
    setUserMsg("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.CHATBOT.ASK, { message: userMsg });
      const botReply = response.data.reply;
      setMessages([...newMessages, { role: "bot", text: botReply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "bot", text: "❌ Error procesando la solicitud." }]);
    }

    setLoading(false);
  };

  return (
    <DashboardLayout activeMenu="Chatbot">
      <div className="p-6 h-[80vh] flex flex-col">
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded shadow">
          {messages.map((m, i) => (
            <div key={i} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
              <div className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${
                m.role === "user" ? "bg-purple-200 text-black" : "bg-white border text-black"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-500 italic">La IA está pensando...</div>}
        </div>

        <div className="mt-4 flex">
          <input
            className="flex-1 border px-4 py-2 rounded-l"
            value={userMsg}
            onChange={(e) => setUserMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Write your questions here..."
          />
          <button
            onClick={handleSend}
            className="bg-purple-600 text-white px-5 py-2 rounded-r"
          >
            Enviar
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatbotPage;
