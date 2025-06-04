// src/api/handler.ts
import express, { Request, Response } from "express";
import { spawn } from "child_process";

const app = express();
const port = 3001;

app.use(express.json());

app.post("/create-note", async (req: Request, res: Response): Promise<void> => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: "title과 content는 필수입니다." });
    return;
  }

  try {
    const mcpProcess = spawn(`npx tsx src/mcp/server.ts`, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"]
    });

    const rpcRequest = JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "create_simple_note",
        arguments: { title, content },
      },
      id: 1,
    }) + "\n";

    mcpProcess.stdin.write(rpcRequest);

    let resultText = "";
    let buffer = "";

    mcpProcess.stdout.on("data", (data) => {
      buffer += data.toString();

      // 줄 단위 처리
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        try {
          const parsed = JSON.parse(line);
          if (parsed.id === 1 && parsed.result?.content?.[0]?.text) {
            resultText = parsed.result.content[0].text;
            mcpProcess.kill();
            res.json({ message: resultText });
            return;
          }
        } catch (err) {
          // JSON 파싱 실패 시 무시 (log, debug 등)
        }
      }
    });

    mcpProcess.stderr.on("data", (err) => {
      console.error("[MCP Error]", err.toString());
    });

    mcpProcess.on("close", (code) => {
      if (!resultText) {
        res.status(500).json({ error: "응답을 받지 못했습니다." });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "MCP 실행 중 오류", detail: err });
  }
});

app.listen(port, () => {
  console.log(`🚀 API 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
