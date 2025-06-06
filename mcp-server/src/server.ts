import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import express from "express";
import { Client as NotionClient } from "@notionhq/client";
import { MCP_PORT, MCP_SERVER_URL, NOTION_API_TOKEN, NOTION_TEST_PAGE_ID } from "./constants/api";

const port = MCP_PORT;
const mcp_url = MCP_SERVER_URL;

const app = express();
app.use(express.json());

const server = new McpServer({
  name: "notion-mcp-server",
  version: "1.0.0",
});

server.tool(
  "create_simple_note",
  {
    title: z.string(),
    content: z.string(),
    // NOTION_API_TOKEN: z.string(),
    // NOTION_TEST_PAGE_ID: z.string(),
  },
  async ({ title, content }) => {
    const notion = new NotionClient({ auth: NOTION_API_TOKEN });

    // 간단한 텍스트 블록 페이지 생성 예시
    await notion.pages.create({
      parent: { page_id: NOTION_TEST_PAGE_ID },
      properties: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content } }],
          },
        },
      ],
    });

    return {
      content: [{ type: "text", text: "✅ 노트 생성 완료!" }],
    };
  }
);

// 🌐 MCP HTTP Endpoint 설정
app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on("close", () => {
    transport.close();
    server.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(port, () => {
  console.log(`🚀 Notion MCP Server is running on ${mcp_url}/mcp`);
});
