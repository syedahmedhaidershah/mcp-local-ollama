# mcp-ollama

Minimal MCP server that delegates prompts to a local Ollama model.

## 1) Start Ollama first (Docker Compose)

From the `mcp-ollama` directory:

```bash
docker compose up -d
```

This starts Ollama and auto-pulls `${DEFAULT_MODEL:-phi4-mini}` on container startup.

Verify Ollama is running:

```bash
curl http://localhost:11434/api/tags
```

## 2) Optional: pull or switch model manually

The server defaults to `phi4-mini` (see `.env.example`).

```bash
docker compose exec ollama ollama pull phi4-mini
```

If you want a different default model, copy `.env.example` to `.env` and update `DEFAULT_MODEL`, then restart:

```bash
docker compose down
docker compose up -d
```

## 3) Build and run the MCP server

```bash
npm install
npm run build
node build/index.js
```

The server communicates over stdio and will call Ollama at `http://localhost:11434`.
