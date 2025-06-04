// test-create-note.ts
import fetch from "node-fetch";

const run = async () => {
  const res = await fetch("http://localhost:3001/create-note", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Node 요청 테스트",
      content: "이건 fetch로 테스트하는 내용입니다.",
    }),
  });

  const data = await res.json();
  console.log("응답:", data);
};

run();
