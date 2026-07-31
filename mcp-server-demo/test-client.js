// ЩО ЦЕ: мінімальний MCP client для автоматизованої перевірки server.js
// без браузера/Inspector — піднімає server.js як subprocess (stdio),
// викликає tools/resources/prompts і виводить результат у консоль.
//
// НАВІЩО: MCP Inspector (browser-based) — головний інструмент для
// ручного тестування (див. курс, модуль "The server inspector"). Але
// для швидкої перевірки "чи взагалі working" (напр. в CI, чи одразу
// після зміни коду) зручніше мати такий скрипт під рукою.
//
// ЗАПУСК: npm run mcp:test  (з кореня проєкту)

const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const {
  StdioClientTransport,
} = require("@modelcontextprotocol/sdk/client/stdio.js");
const path = require("path");

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: [path.join(__dirname, "server.js")],
  });

  const client = new Client({ name: "test-client", version: "1.0.0" });
  await client.connect(transport);

  // --- TOOLS ---
  const tools = await client.listTools();
  console.log("✅ Tools available:", tools.tools.map((t) => t.name));

  const before = await client.callTool({
    name: "read_doc_contents",
    arguments: { doc_id: "deposition.md" },
  });
  console.log("✅ read_doc_contents (до редагування):", before.content[0].text);

  const edit = await client.callTool({
    name: "edit_document",
    arguments: {
      doc_id: "deposition.md",
      old_str: "Angela Smith",
      new_str: "Volodymyr Klekot",
    },
  });
  console.log("✅ edit_document:", edit.content[0].text);

  const after = await client.callTool({
    name: "read_doc_contents",
    arguments: { doc_id: "deposition.md" },
  });
  console.log(
    "✅ read_doc_contents (після редагування, перевірка state):",
    after.content[0].text
  );

  // --- RESOURCES ---
  const resources = await client.listResources();
  console.log(
    "✅ Direct resources:",
    resources.resources.map((r) => r.uri)
  );

  const templates = await client.listResourceTemplates();
  console.log(
    "✅ Resource templates:",
    templates.resourceTemplates.map((t) => t.uriTemplate)
  );

  const docList = await client.readResource({ uri: "docs://documents" });
  console.log("✅ docs://documents →", docList.contents[0].text);

  const docContent = await client.readResource({
    uri: "docs://documents/report.pdf",
  });
  console.log(
    "✅ docs://documents/report.pdf →",
    docContent.contents[0].text
  );

  // --- PROMPTS ---
  const prompts = await client.listPrompts();
  console.log(
    "✅ Prompts available:",
    prompts.prompts.map((p) => p.name)
  );

  const formatPrompt = await client.getPrompt({
    name: "format",
    arguments: { doc_id: "report.pdf" },
  });
  console.log(
    "✅ prompt 'format' (перше повідомлення, скорочено):",
    formatPrompt.messages[0].content.text.slice(0, 60) + "..."
  );

  await client.close();
  console.log("\n🎉 Усі перевірки пройшли успішно (tools + resources + prompts).");
}

main().catch((err) => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
