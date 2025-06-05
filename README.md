# Notion MCP Server

This project contains a small server that exposes Model Context Protocol tools backed by the Notion API.

## Setup

1. Install dependencies for the server:
   ```bash
   cd server
   npm install
   ```
2. Copy `.env.example` to `server/.env` and fill in the required values.
   ```bash
   cp ../.env.example .env
   ```
   - `NOTION_API_TOKEN` – your Notion integration token.
   - `NOTION_TEST_PAGE_ID` – ID of the page used for note creation.
   - `PORT` – optional port for the Express API.

## Running the server

From the `server` directory run:
```bash
npm run mcp
```
