// ЩО ЦЕ: наскрізний walkthrough — використовує TodoMCPClient, щоб
// пройти через усі 3 примітиви MCP по черзі й надрукувати результат.
// Це і є "запустити й побачити все", про що просили: жодного браузера,
// просто читабельний вивід у консоль.
//
// ЗАПУСК: npm run todo:demo   (з кореня проєкту)

const { TodoMCPClient } = require("./client");

async function main() {
  const client = new TodoMCPClient("node", [`${__dirname}/server.js`]);
  await client.connect();
  console.log("✅ Підключено до TodoMCP\n");

  console.log("Tools:", (await client.listTools()).map((t) => t.name));
  console.log("Prompts:", (await client.listPrompts()).map((p) => p.name));
  const resources = await client.listResources();
  console.log("Resources (direct):", resources.direct.map((r) => r.uri));
  console.log("Resources (templated):", resources.templated.map((r) => r.uriTemplate));
  console.log();

  // --- Tools в дії ---
  console.log((await client.callTool("add_todo", { text: "Write MCP example" })).content[0].text);
  console.log((await client.callTool("add_todo", { text: "Review pull request" })).content[0].text);
  console.log((await client.callTool("complete_todo", { id: 1 })).content[0].text);
  console.log();

  // --- Resources в дії ---
  console.log("todos://all   →", (await client.readResource("todos://all")).text);
  console.log("todos://2     →", (await client.readResource("todos://2")).text);
  console.log();

  // --- Prompts в дії ---
  const messages = await client.getPrompt("plan_day");
  console.log("prompt 'plan_day' →", messages[0].content.text);

  await client.cleanup();
  console.log("\n🎉 Готово — усі 3 примітиви (tools, resources, prompts) відпрацювали.");
}

main().catch((err) => {
  console.error("❌ FAILED:", err);
  process.exit(1);
});
