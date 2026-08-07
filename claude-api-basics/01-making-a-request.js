// Модуль курсу: Accessing the API / Getting an API key / Making a Request
// Перший запит до Claude напряму, без helpers — щоб побачити "сирий" виклик.

require("dotenv").config();
const { client, model } = require("./chat-utils");

async function main() {
  const message = await client.messages.create({
    model,
    max_tokens: 1000,
    messages: [{ role: "user", content: "What is quantum computing? Answer in one sentence" }],
  });

  // ⚠️ НЕ message.content[0].text — Claude Sonnet 5 (adaptive thinking за
  // замовчуванням) може повернути ThinkingBlock першим блоком. Шукаємо
  // текстовий блок за type (той самий фікс, що й у chat-utils.js).
  const textBlock = message.content.find((b) => b.type === "text");

  console.log("Текст відповіді:", textBlock.text);
  console.log("Usage (input/output tokens):", message.usage);
  console.log("Stop reason:", message.stop_reason);
}

main().catch(console.error);
