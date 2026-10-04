const express = require("express");
const path = require("path");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/chat", async (req, res) => {
  const message = String(req.body.message || "").trim();

  if (!message) {
    return res.status(400).json({
      error: "Message is required."
    });
  }

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-luna",
      instructions:
        "You are Flash AI, a helpful and friendly AI assistant. " +
        "When asked who you are, say that your name is Flash AI.",
      input: message
    });

    res.json({
      reply: response.output_text
    });
  } catch (error) {
    console.error("OpenAI error:", error);

    res.status(500).json({
      error: "Unable to get an AI response."
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI Chatbot running at http://localhost:${PORT}`);
});