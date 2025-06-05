# Notion MCP Server

This repository contains a simple Express API that interacts with a Model Context Protocol (MCP) server and the Notion API.

## Environment Variables

Configuration is provided via a `.env` file located in the `server` directory. Copy `server/.env.example` to `server/.env` and fill in the required values.

| Variable | Description |
| -------- | ----------- |
| `PORT` | Port used by the API server (defaults to `3001`). |
| `NOTION_API_TOKEN` | Notion integration token for API access. |
| `NOTION_TEST_PAGE_ID` | Page ID where test notes will be created. |

## Running the Server

Install dependencies and start the API in development mode:

```bash
cd server
npm install
npm run dev
```

The server will start on the port defined by `PORT` or `3001` by default.
