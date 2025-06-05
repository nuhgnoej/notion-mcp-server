// gateway-server/src/routes/create-note.ts
import express from "express";
import { sendNoteToMcp } from "../services/mcp.service";

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, content, destination } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "title과 content는 필수입니다." });
  }

  try {
    // 기본 destination은 'notion'
    const dest = destination || "notion";

    const result = await sendNoteToMcp({ title, content, destination: dest });
    res.json({ message: "✅ 노트 전송 완료", ...result });
  } catch (err: any) {
    console.error("❌ MCP 전송 오류:", err);
    res.status(500).json({ message: "MCP 서버 전송 실패", error: err.message });
  }
});

export default router;
