// apps/gateway-server/src/routes/generate-message.ts
import express from "express";
import OpenAI from "openai";

const router = express.Router();

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
});

export default router;
