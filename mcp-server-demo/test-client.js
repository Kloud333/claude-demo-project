// ЩО ЦЕ: мінімальний MCP client для автоматизованої перевірки server.js
// без браузера/Inspector — піднімає server.js як subprocess (stdio),
// викликає tools і виводить результат у консоль.
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

  await client.close();
  console.log("\n🎉 Усі перевірки пройшли успішно.");
}

main().catch((err) => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
