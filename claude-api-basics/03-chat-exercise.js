// Вправа курсу: Chat Exercise
// Чат-бот на трьох helper-функціях. Замість Jupyter input() тут
// вбудований у Node.js модуль readline — справжній інтерактивний
// термінал-чат. Запуск: node 03-chat-exercise.js
// Вихід: Ctrl+C, або команда "exit"/"quit".

require("dotenv").config();
const readline = require("readline/promises");
const { addUserMessage, addAssistantMessage, chat } = require("./chat-utils");

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const messages = []; // живе поза циклом — накопичує історію розмови

  console.log('Чат готовий. Пиши повідомлення (або "exit" для виходу).\n');

  while (true) {
    const userInput = await rl.question("> ");
    if (["exit", "quit"].includes(userInput.toLowerCase())) {
      console.log("Бувай!");
      break;
    }

    addUserMessage(messages, userInput);
    const answer = await chat(messages);
    addAssistantMessage(messages, answer); // щоб Claude пам'ятав і свою відповідь

    console.log("---");
    console.log(answer);
    console.log();
  }

  rl.close();
}

main().catch(console.error);
