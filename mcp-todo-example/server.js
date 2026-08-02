// ЩО ЦЕ: другий, мінімальний, самодостатній приклад MCP server — окремо
// від mcp-server-demo/ (документи). Тут — простий todo-менеджер, щоб
// логіка була максимально прозора, без "шуму" по темі. Мета: показати
// усі 3 примітиви MCP (tools, resources, prompts) в одному компактному
// файлі.
//
// ЛОГІКА: todos зберігаються в пам'яті як масив об'єктів
// { id, text, done }. Нічого зайвого — жодної БД, жодної валідації
// понад мінімально необхідну.

const {
  McpServer,
  ResourceTemplate,
} = require("@modelcontextprotocol/sdk/server/mcp.js");
const {
  StdioServerTransport,
} = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");

const server = new McpServer({ name: "TodoMCP", version: "1.0.0" });

let todos = [];
let nextId = 1;

// --- TOOLS (Claude сам вирішує, коли викликати) ---

// Додає новий todo.
server.registerTool(
  "add_todo",
  {
    description: "Add a new todo item.",
    inputSchema: { text: z.string().describe("Todo text") },
  },
  async ({ text }) => {
    const todo = { id: nextId++, text, done: false };
    todos.push(todo);
    return { content: [{ type: "text", text: `Added todo #${todo.id}: "${text}"` }] };
  }
);

// Позначає todo як виконаний.
server.registerTool(
  "complete_todo",
  {
    description: "Mark a todo as done.",
    inputSchema: { id: z.number().describe("Todo id") },
  },
  async ({ id }) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) throw new Error(`Todo #${id} not found`);
    todo.done = true;
    return { content: [{ type: "text", text: `Todo #${id} marked as done.` }] };
  }
);

// --- RESOURCES (застосунок вирішує, коли підтягнути дані) ---

// Direct resource: увесь список todos, як є.
server.registerResource(
  "list_todos",
  "todos://all",
  { title: "All todos", mimeType: "application/json" },
  async (uri) => ({
    contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(todos) }],
  })
);

// Templated resource: один конкретний todo за {id}.
server.registerResource(
  "get_todo",
  new ResourceTemplate("todos://{id}", { list: undefined }),
  { title: "Single todo", mimeType: "application/json" },
  async (uri, { id }) => {
    const todo = todos.find((t) => t.id === Number(id));
    if (!todo) throw new Error(`Todo #${id} not found`);
    return { contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(todo) }] };
  }
);

// --- PROMPTS (юзер сам запускає готовий workflow) ---

// Без аргументів (на відміну від prompts у mcp-server-demo/) — показує,
// що параметри в prompt опціональні, не обов'язкові.
server.registerPrompt(
  "plan_day",
  {
    title: "Plan my day",
    description: "Suggests a short priority plan based on current todos.",
  },
  async () => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "Look at my current todo list (use the available tools/resources to check it), then suggest a short 3-bullet priority plan for today.",
        },
      },
    ],
  })
);

async function main() {
  await server.connect(new StdioServerTransport());
}
main().catch((err) => {
  console.error("Fatal error running TodoMCP server:", err);
  process.exit(1);
});
