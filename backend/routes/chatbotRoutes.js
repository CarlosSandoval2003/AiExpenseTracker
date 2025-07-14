const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { handleChatbotMessage } = require("../controllers/chatbotController");


const router = express.Router();

router.post("/chatbot", protect, handleChatbotMessage);

module.exports = router;
