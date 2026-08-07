// Модуль курсу: Response Streaming
// Показуємо текст шматками по мірі генерації, замість очікування
// повної відповіді 10-30с.

require("dotenv").config();
const { client, model, addUserMessage } = require("./chat-utils");

async function rawEvents() {
  console.log("=== Сирі events (назви — звір з конспектом) ===");
  const messages = [];
  addUserMessage(messages, "Write a 1 sentence description of a fake database");

  const stream = client.messages.stream({ model, max_tokens: 1000, messages });
  for await (const event of stream) {
    console.log(event.type); // message_start, content_block_delta, ...
  }
}

async function simplifiedText() {
  console.log("\n=== Спрощений варіант — тільки текст ===");
  const messages = [];
  addUserMessage(messages, "Write a 1 sentence description of a fake database");

  const stream = client.messages.stream({ model, max_tokens: 1000, messages });
  stream.on("text", (delta) => process.stdout.write(delta));
  await stream.finalMessage(); // дочекатись завершення стріму
  console.log();
}

async function withFinalMessage() {
  console.log("\n=== Повне повідомлення після стрімінгу (для БД) ===");
  const messages = [];
  addUserMessage(messages, "Write a 1 sentence description of a fake database");

  const stream = client.messages.stream({ model, max_tokens: 1000, messages });
  stream.on("text", (delta) => process.stdout.write(delta));

  const finalMessage = await stream.finalMessage();
  console.log("\n\n--- Повний message-об'єкт ---");
  console.log(finalMessage);
}

async function main() {
  await rawEvents();
  await simplifiedText();
  await withFinalMessage();
}

main().catch(console.error);
