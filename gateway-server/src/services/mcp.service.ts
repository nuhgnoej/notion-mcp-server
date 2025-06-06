// gateway-server/src/services/mcp.service.ts
import { MCP_SERVER_URL } from "constants/api";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

type SendNotePayload = {
  title: string;
  content: string;
  destination: string;
};

const BASE_URL = "https://ominous-capybara-5g5x49wj5rgvhpx7w-8080.app.github.dev/mcp";

export async function sendNoteToMcp({
  title,
  content,
  destination,
}: SendNotePayload) {
  const transport = new StreamableHTTPClientTransport(new URL(`${BASE_URL}`));

  const client = new Client({
    name: "notion-client",
    version: "1.0.0",
  });

  await client.connect(transport);

  const result = await client.callTool({
    name: "create_simple_note",
    arguments: {
      title,
      content,
    },
  });

  console.log("📥 Tool Result:", result);
}
