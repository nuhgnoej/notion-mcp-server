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

const PORT = process.env.GATEWAY_SERVER_PORT || 3001;
const GATEWAY_SERVER_URL = process.env.GATEWAY_SERVER_URL;
app.listen(PORT, () => {
  console.log(
    `🚀 Gateway Server running on ${GATEWAY_SERVER_URL}`
  );
});
