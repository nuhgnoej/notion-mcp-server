// src/constants/api.ts
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MCP_SERVER_URL || !process.env.MCP_PORT) {
  throw new Error("환경변수가 설정되지 않았습니다.");
}

export const MCP_SERVER_URL = process.env.MCP_SERVER_URL!;
export const MCP_PORT = process.env.MCP_PORT!;
export const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN!;
export const NOTION_TEST_PAGE_ID = process.env.NOTION_TEST_PAGE_ID!;
