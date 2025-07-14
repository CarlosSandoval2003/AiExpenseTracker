import React, { useState } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMsg, setUserMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userMsg) return;

    const newMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(newMessages);
    setUserMsg("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.CHATBOT.ASK, { message: userMsg });
      const botReply = response.data.reply;

      setMessages([...newMessages, { role: "bot", text: botReply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "bot", text: "Error procesando la solicitud." }]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 bg-white p-4 shadow-lg rounded-lg w-80 border">
      <div className="h-64 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`p-2 rounded ${m.role === "user" ? "bg-purple-100" : "bg-gray-200"}`}>
              {m.text}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-500">Pensando...</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="border flex-1 px-2 py-1 rounded"
          value={userMsg}
          onChange={(e) => setUserMsg(e.target.value)}
          placeholder="Haz una pregunta..."
        />
        <button onClick={handleSend} className="bg-purple-500 text-white px-3 py-1 rounded">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
