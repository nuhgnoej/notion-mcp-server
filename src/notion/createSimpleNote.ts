// src/notion/createSimpleNote.ts
import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
const TEST_PAGE_ID = process.env.NOTION_TEST_PAGE_ID;

if (!TEST_PAGE_ID) {
  throw new Error("NOTION_TEST_PAGE_ID environment variable is not set");
}

export async function createSimpleNote(title: string, content: string): Promise<string> {
  const now = new Date().toISOString();
  const response = await notion.blocks.children.append({
    block_id: TEST_PAGE_ID,
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: title } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: `생성 시간: ${now}` },
              annotations: { color: "gray" },
            },
          ],
        },
      },
    ],
  });

  return response.results[0]?.id || "unknown";
}
