// apps/gateway-server/src/index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import generateMessageRoute from "./routes/generate-message";
import createNoteRoute from "./routes/create-note";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/generate-message", generateMessageRoute);
app.use("/create-note", createNoteRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(
    `🚀 Gateway Server running on https://ominous-capybara-5g5x49wj5rgvhpx7w-3001.app.github.dev`
  );
});
