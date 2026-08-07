// Модуль курсу: System Prompts (+ System Prompts Exercise)
// system prompt керує ЯК Claude відповідає (тон/роль), не ЩО відповідає.

require("dotenv").config();
const { addUserMessage, chat } = require("./chat-utils");

async function mathTutorExample() {
  console.log("=== Math Tutor: без system prompt ===");
  const messages1 = [];
  addUserMessage(messages1, "How do I solve 5x + 2 = 3 for x?");
  console.log(await chat(messages1));

  console.log("\n=== Math Tutor: з system prompt ===");
  const systemPrompt = `
You are a patient math tutor.
Do not directly answer a student's questions.
Guide them to a solution step by step.
`;
  const messages2 = [];
  addUserMessage(messages2, "How do I solve 5x + 2 = 3 for x?");
  console.log(await chat(messages2, { system: systemPrompt }));
}

async function conciseCodeExercise() {
  // ➕ System Prompts Exercise (з відео): той самий принцип працює й для
  // стилю коду, не тільки тону в чаті.
  console.log("\n=== Exercise: лаконічний Python-код через system prompt ===");
  const messages = [];
  addUserMessage(messages, "Write a Python function that checks a string for duplicate characters.");
  const answer = await chat(messages, {
    system: "You are a Python engineer who writes very concise code",
  });
  console.log(answer);
}

async function main() {
  await mathTutorExample();
  await conciseCodeExercise();
}

main().catch(console.error);
