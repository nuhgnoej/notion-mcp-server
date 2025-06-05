// apps/gateway-server/src/routes/generate-message.ts
import express from "express";
import { generateMessage } from "../services/openai.service";
import OpenAI from "openai";

const router = express.Router();

const models = [
  "gpt-4.1",
  "o4-mini",
  "o3",
  "o3-mini",
  "o1",
  "o1-mini",
  "o1-pro",
];

router.post("/", async (req, res) => {
  const { prompt, model } = req.body;
  const client = new OpenAI();

  try {
    const response = await client.responses.create({
      model: model,
      input: prompt,
    });
    console.log(response.output_text);
    const text = response.output_text;
    res.json({ content: text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }

  // const { prompt, model } = req.body;

  // try {
  //   const content = await generateMessage(prompt, model || "chatgpt");
  //   res.json({ content });
  // } catch (err: any) {
  //   res.status(500).json({ error: err.message });
  // }
});

export default router;
