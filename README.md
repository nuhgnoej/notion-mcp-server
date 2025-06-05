# Notion MCP Server

This repository contains a Node.js server and a React Native front‑end powered by Expo. The server provides a Model Context Protocol interface to Notion, while the front‑end acts as the client.

## Prerequisites

- **Node.js** (version 18 or higher recommended)
- **npm**

## Installing dependencies

Install the server dependencies:

```bash
cd server
npm install
```

Install the front‑end dependencies:

```bash
cd ../frontend
npm install
```

## Environment variables

The server expects a couple of environment variables. They can be placed in a `.env` file inside the `server/` directory or exported in your shell environment.

- `NOTION_API_TOKEN` – Notion integration token used to authenticate requests.
- `NOTION_TEST_PAGE_ID` – ID of the Notion page used when creating test notes.

Example `.env` file:

```
NOTION_API_TOKEN=your_notion_token
NOTION_TEST_PAGE_ID=your_page_id
```

## Running the project

Start the server in development mode:

```bash
cd server
npm run dev
```

Start the front‑end:

```bash
cd ../frontend
npm start
```

