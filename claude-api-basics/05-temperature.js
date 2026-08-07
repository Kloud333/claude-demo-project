// Модуль курсу: Temperature
// 0 = детерміновано, 1 = креативно/варіативно.
//
// ⚠️ Claude Sonnet 5 (наша дефолтна модель) ПОВНІСТЮ деприкейтила
// temperature — сам факт наявності поля кидає 400, навіть =1.0.
// Демонструємо на claude-sonnet-4-5-20250929, де параметр ще працює.

require("dotenv").config();
const { addUserMessage, chat } = require("./chat-utils");

const DEMO_MODEL = "claude-sonnet-4-5-20250929";

async function main() {
  const prompt = "Give me a one-sentence idea for a movie plot.";

  console.log("=== Low temperature (0.0) — передбачувано ===");
  for (let i = 0; i < 2; i++) {
    const messages = [];
    addUserMessage(messages, prompt);
    console.log(await chat(messages, { temperature: 0.0, modelOverride: DEMO_MODEL }));
  }

  console.log("\n=== High temperature (1.0) — креативно ===");
  for (let i = 0; i < 2; i++) {
    const messages = [];
    addUserMessage(messages, prompt);
    console.log(await chat(messages, { temperature: 1.0, modelOverride: DEMO_MODEL }));
  }
}

main().catch(console.error);
