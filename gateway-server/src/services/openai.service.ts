// apps/gateway-server/src/services/openai.service.ts
import fetch from "node-fetch";

export async function generateMessage(
  prompt: string,
  model: string
): Promise<string> {
  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model === "chatgpt" ? "gpt-3.5-turbo" : "gpt-4",
      messages: [
        { role: "system", content: "너는 창의적인 노트 작성 보조 도우미야." },
        { role: "user", content: prompt },
      ],
    }),
  });

  const json = (await openaiRes.json()) as {
    choices?: { message?: { content: string } }[];
  };
  return json.choices?.[0]?.message?.content ?? "응답 없음";
}
