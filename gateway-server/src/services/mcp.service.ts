// gateway-server/src/services/mcp.service.ts
import fetch from "node-fetch";

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:8080";

type SendNotePayload = {
  title: string;
  content: string;
  destination: string;
};

export async function sendNoteToMcp({ title, content, destination }: SendNotePayload) {
  if (destination === "notion") {
    const res = await fetch(`${MCP_SERVER_URL}/tool/create_simple_note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error("MCP 응답 실패: " + error);
    }

    const json = await res.json();
    return json;
  }

  throw new Error(`지원하지 않는 destination: ${destination}`);
}
