// ЩО ЦЕ: реальний, робочий MCP server на офіційному JS/Node SDK
// (@modelcontextprotocol/sdk). Той самий "DocumentMCP" приклад, що
// вивчається на курсі "Introduction to MCP" (Python SDK), тут переписаний
// на JS — щоб показати, що MCP не прив'язаний до однієї мови (SDK також
// офіційно існують для PHP, Go, C#, Kotlin, Ruby, Rust, Swift).
//
// НАВІЩО: решта .claude/ у цьому репо — ілюстративна конфігурація
// Claude Code (як з нею працювати). Цей файл — інша категорія: приклад
// того, ЯК САМОМУ побудувати MCP server, який Claude Code (чи будь-який
// інший MCP client) може підключити через .mcp.json.
//
// СТАТУС: поступова реалізація, синхронно з курсом "Introduction to MCP".
// Зараз реалізовано тільки tools (Defining tools with MCP). Resources і
// prompts додамо після відповідних модулів курсу — так само, як росте
// starter-проєкт курсу (cli_project) на Python.

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const {
  StdioServerTransport,
} = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");

const server = new McpServer({ name: "DocumentMCP", version: "1.0.0" });

// Документи в пам'яті — той самий набір, що й у Python-версії курсу,
// щоб можна було порівнювати обидві реалізації напряму.
const docs = {
  "deposition.md":
    "This deposition covers the testimony of Angela Smith, P.E.",
  "report.pdf": "The report details the state of a 20m condenser tower.",
  "financials.docx":
    "These financials outline the project's budget and expenditures.",
  "outlook.pdf":
    "This document presents the projected future performance of the system.",
  "plan.md": "The plan outlines the steps for the project's implementation.",
  "spec.txt":
    "These specifications define the technical requirements for the equipment.",
};

// Tool 1: читання документа.
// inputSchema — це raw-об'єкт із zod-схемами (аналог Field(description=...)
// у Python SDK) — SDK сам генерує з нього JSON schema для Claude.
server.registerTool(
  "read_doc_contents",
  {
    description: "Read the contents of a document and return it as a string.",
    inputSchema: {
      doc_id: z.string().describe("Id of the document to read"),
    },
  },
  async ({ doc_id }) => {
    if (!(doc_id in docs)) {
      throw new Error(`Doc with id ${doc_id} not found`);
    }
    return { content: [{ type: "text", text: docs[doc_id] }] };
  }
);

// Tool 2: find-and-replace редагування документа.
server.registerTool(
  "edit_document",
  {
    description:
      "Edit a document by replacing a string in the documents content with a new string.",
    inputSchema: {
      doc_id: z.string().describe("Id of the document that will be edited"),
      old_str: z
        .string()
        .describe(
          "The text to replace. Must match exactly, including whitespace."
        ),
      new_str: z
        .string()
        .describe("The new text to insert in place of the old text."),
    },
  },
  async ({ doc_id, old_str, new_str }) => {
    if (!(doc_id in docs)) {
      throw new Error(`Doc with id ${doc_id} not found`);
    }
    docs[doc_id] = docs[doc_id].replace(old_str, new_str);
    return { content: [{ type: "text", text: `Updated ${doc_id}` }] };
  }
);

// TODO (наступні модулі курсу):
// - resource: список усіх doc id's
// - resource: вміст конкретного doc (templated URI)
// - prompt: переписати doc у markdown
// - prompt: підсумувати doc

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error running DocumentMCP server:", err);
  process.exit(1);
});
