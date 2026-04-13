import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-require-imports
// @ts-ignore
import process from "process";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "phi4-mini";

// Create MCP server
const server = new McpServer({
  name: `ollama-helper-${DEFAULT_MODEL}`,
  version: "1.0.0",
});

// Tool: ask phi4-mini
server.registerTool(
  "delegate_phi4mini",
  {
    "description": `Delegate a task to the ${DEFAULT_MODEL} model`,
    "inputSchema": z.object({
      prompt: z.string(),
    }),
  },
  async ({ prompt }) => {
    try {
      const res = await axios.post("http://localhost:11434/api/generate", {
        model: DEFAULT_MODEL,
        prompt,
        stream: false,
      });

      const result = {
        content: [
          {
            type: "text" as const,
            text: String(res.data.response ?? ""),
          },
        ],
      };
      console.error("DEBUG result:", JSON.stringify(result));
      return result;
    } catch (err: any) {
      const errResult = {
        content: [
          {
            type: "text" as const,
            text: "Error talking to Ollama ".concat(err?.message ?? ""),
          },
        ],
      };
      console.error("DEBUG error result:", JSON.stringify(errResult));
      return errResult;
    }
  }
);

// Start server (stdio transport)
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ollama MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});