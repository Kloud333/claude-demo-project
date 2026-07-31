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
// СТАТУС: реалізація завершена — усі 3 примітиви MCP присутні:
//   • Tools     — дії, які Claude сам вирішує викликати (model-controlled)
//   • Resources — дані для UI/контексту, вирішує застосунок (app-controlled)
//   • Prompts   — готові workflow, запускає юзер (user-controlled)
// Детальніше про різницю — mcp-server-demo/README.md.

const {
  McpServer,
  ResourceTemplate,
} = require("@modelcontextprotocol/sdk/server/mcp.js");
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

// ============================================================
// TOOLS — Claude сам вирішує, коли їх викликати
// ============================================================

// Tool 1: читання документа.
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

// ============================================================
// RESOURCES — дані для застосунку (UI-автокомпліт, контекст)
// ============================================================

// Direct resource: статичний URI без параметрів → список усіх doc id's.
// Використання: автокомпліт "@" у чат-інтерфейсі показує ці id's.
server.registerResource(
  "list_documents",
  "docs://documents",
  {
    title: "Список документів",
    description: "Повертає список id всіх доступних документів (JSON-масив).",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(Object.keys(docs)),
      },
    ],
  })
);

// Templated resource: URI з параметром {doc_id} → вміст конкретного doc.
// SDK сам парсить {doc_id} з URI і передає другим аргументом callback'а.
// Використання: коли юзер згадує "@report.pdf" — вміст інжектиться прямо
// в промпт до Claude, без окремого tool call.
server.registerResource(
  "fetch_document",
  new ResourceTemplate("docs://documents/{doc_id}", { list: undefined }),
  {
    title: "Вміст документа",
    description: "Повертає повний текстовий вміст конкретного документа за id.",
    mimeType: "text/plain",
  },
  async (uri, { doc_id }) => {
    if (!(doc_id in docs)) {
      throw new Error(`Doc with id ${doc_id} not found`);
    }
    return {
      contents: [{ uri: uri.href, mimeType: "text/plain", text: docs[doc_id] }],
    };
  }
);

// ============================================================
// PROMPTS — готові workflow, які запускає юзер (slash-команда)
// ============================================================

// Prompt 1: переформатувати документ у markdown.
// Юзер друкує "/format", обирає doc_id — Claude отримує готову, наперед
// продуману інструкцію (замість того, щоб юзер сам писав промпт).
server.registerPrompt(
  "format",
  {
    title: "Format as Markdown",
    description: "Rewrites the contents of the document in Markdown format.",
    argsSchema: {
      doc_id: z.string().describe("Id of the document to format"),
    },
  },
  async ({ doc_id }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Your goal is to reformat a document to be written with markdown syntax.

The id of the document you need to reformat is:
<document_id>
${doc_id}
</document_id>

Add in headers, bullet points, tables, etc as necessary. Feel free to add in structure.
Use the 'edit_document' tool to edit the document. After the document has been reformatted, let the user know it's done.`,
        },
      },
    ],
  })
);

// Prompt 2: підсумувати документ.
// Той самий патерн, інша спеціалізована задача — навмисно коротка
// інструкція, щоб показати, що prompts не обов'язково великі.
server.registerPrompt(
  "summarize",
  {
    title: "Summarize document",
    description: "Summarizes the contents of the document in 2-3 sentences.",
    argsSchema: {
      doc_id: z.string().describe("Id of the document to summarize"),
    },
  },
  async ({ doc_id }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Read the document with id "${doc_id}" using the 'read_doc_contents' tool, then summarize its contents in 2-3 concise sentences.`,
        },
      },
    ],
  })
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error running DocumentMCP server:", err);
  process.exit(1);
});
