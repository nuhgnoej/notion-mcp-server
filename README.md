# Notion MCP Server

This repository contains a small server and Expo frontend. The frontend uses a configurable API base URL so that requests can be directed to different backends.

## Configuring the API URL

The file `frontend/constants/api.ts` exports `API_BASE_URL`. It reads the value from the environment variable `EXPO_PUBLIC_API_BASE_URL` and falls back to `http://localhost:3001` if the variable is not set.

```
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';
```

### Development

Create a `.env` file (or use your preferred method) and set `EXPO_PUBLIC_API_BASE_URL` to the address of your local server:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Production

Set `EXPO_PUBLIC_API_BASE_URL` to your production API URL when building or deploying the Expo app:

```
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
```

The app will use this URL when performing fetch requests.
