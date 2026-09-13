require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    const fullPrompt = `
You are an expert educational tutor.

Rules:
- Answer the user's latest question.
- Use previous conversation only as context.
- Keep answers clear and concise.
- Use examples when helpful.
- Use markdown formatting.

${prompt}
`;

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

    const result =
      await model.generateContent(
        fullPrompt
      );

    const response =
      result.response.text();

    res.json({
      reply: response,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});
app.post("/generate-title", async (req, res) => {
  try {
    const { question } = req.body;

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

    const result =
      await model.generateContent(`
Generate a short thread title (3-5 words max).

Question:
${question}

Return only the title.
`);

    res.json({
      title: result.response.text().trim(),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});