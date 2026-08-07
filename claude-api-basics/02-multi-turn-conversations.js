// Модуль курсу: Multi-Turn Conversations
// Claude нічого не пам'ятає між запитами — треба самому вести історію
// і слати ЇЇ ПОВНІСТЮ з кожним наступним запитом.

require("dotenv").config();
const { addUserMessage, addAssistantMessage, chat } = require("./chat-utils");

async function broken() {
  console.log("=== Без спільної історії (зламано) ===");

  const messages1 = [];
  addUserMessage(messages1, "Define quantum computing in one sentence");
  console.log(await chat(messages1));

  // Новий, ОКРЕМИЙ список — Claude не бачить попереднього питання
  const messages2 = [];
  addUserMessage(messages2, "Write another sentence");
  console.log(await chat(messages2)); // Claude не знає, про що писати
}

async function working() {
  console.log("\n=== Один спільний messages (правильно) ===");

  const messages = [];

  addUserMessage(messages, "Define quantum computing in one sentence");
  const answer = await chat(messages);
  addAssistantMessage(messages, answer); // зберігаємо відповідь Claude теж
  console.log("Claude:", answer);

  addUserMessage(messages, "Write another sentence"); // той самий messages
  const finalAnswer = await chat(messages);
  console.log("Claude (з контекстом):", finalAnswer);
}

async function main() {
  await broken();
  await working();
}

main().catch(console.error);
