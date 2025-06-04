#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config();

// 디버그: 환경 변수 확인
console.error("[Debug] API Token:", process.env.NOTION_API_TOKEN ? "토큰 존재" : "토큰 없음");
console.error("[Debug] Page ID:", process.env.NOTION_TEST_PAGE_ID);

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const TEST_PAGE_ID = process.env.NOTION_TEST_PAGE_ID;

class NotionMCPServer {
  private server: Server;
  
  constructor() {
    this.server = new Server({
      name: "notion-mcp-server",
      version: "0.1.0",
    });

    this.setupToolHandlers();
    
    // 에러 핸들링
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // 도구 목록 반환
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "test_connection",
          description: "MCP 서버 연결 테스트",
          inputSchema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "테스트 메시지",
              },
            },
            required: ["message"],
          },
        },
        {
          name: "create_simple_note",
          description: "Notion에 간단한 노트 생성",
          inputSchema: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "노트 제목",
              },
              content: {
                type: "string",
                description: "노트 내용",
              },
            },
            required: ["title", "content"],
          },
        },
      ],
    }));

    // 도구 실행 핸들러
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        return {
          content: [
            {
              type: "text",
              text: `❌ 인수가 제공되지 않았습니다.`,
            },
          ],
        };
      }

      try {
        switch (name) {
          case "test_connection":
            return await this.testConnection(args.message as string);
            
          case "create_simple_note":
            return await this.createSimpleNote(
              args.title as string,
              args.content as string
            );
            
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        console.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: "text",
              text: `❌ 오류 발생: ${error?.message || error}`,
            },
          ],
        };
      }
    });
  }

  private async testConnection(message: string) {
    console.log(`[Test Connection] ${message}`);
    
    // Notion API 연결 테스트
    try {
      const response = await notion.users.me({});
      const userName = response.name || "Unknown User";
      
      return {
        content: [
          {
            type: "text",
            text: `✅ MCP 서버 및 Notion API 연결 성공!\n메시지: ${message}\n연결된 사용자: ${userName}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `⚠️ MCP 서버는 연결되었지만 Notion API 연결 실패\n메시지: ${message}\n오류: ${(error as Error)?.message || error}`,
          },
        ],
      };
    }
  }

  private async createSimpleNote(title: string, content: string) {
    console.log(`[Create Note] Title: ${title}, Content: ${content}`);
    
    if (!TEST_PAGE_ID) {
      return {
        content: [
          {
            type: "text",
            text: `❌ NOTION_TEST_PAGE_ID가 설정되지 않았습니다.`,
          },
        ],
      };
    }

    try {
      // Notion 페이지에 블록 추가
      const response = await notion.blocks.children.append({
        block_id: TEST_PAGE_ID,
        children: [
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: title,
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: content,
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: `생성 시간: ${new Date().toISOString()}`,
                  },
                  annotations: {
                    color: "gray",
                  },
                },
              ],
            },
          },
        ],
      });

      return {
        content: [
          {
            type: "text",
            text: `✅ Notion 페이지에 노트가 성공적으로 생성되었습니다!\n\n📝 제목: ${title}\n💬 내용: ${content}\n🕒 생성 시간: ${new Date().toISOString()}\n🔗 블록 ID: ${response.results[0]?.id}`,
          },
        ],
      };
    } catch (error) {
      console.error("Notion API Error:", error);
      return {
        content: [
          {
            type: "text",
            text: `❌ Notion 노트 생성 실패\n오류: ${(error as Error)?.message || error}\n\n📝 로컬 시뮬레이션:\n제목: ${title}\n내용: ${content}\n생성 시간: ${new Date().toISOString()}`,
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Notion MCP Server running on stdio");
  }
}

const server = new NotionMCPServer();
server.run().catch(console.error);