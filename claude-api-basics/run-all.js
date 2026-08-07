// Прогін УСІХ прикладів поспіль (крім 03-chat-exercise — той
// інтерактивний, live-чат, запускай окремо: node 03-chat-exercise.js).
//
// Кожен файл запускається як ОКРЕМИЙ `node` процес по черзі (execFileSync,
// stdio: "inherit") — так само надійно, якби ти сам запускав кожен файл
// один за одним вручну, і без жодних проблем з таймінгом async-коду.
//
// Запуск: npm run api:all  (з кореня проєкту)

const { execFileSync } = require("child_process");
const path = require("path");

const files = [
  "01-making-a-request.js",
  "02-multi-turn-conversations.js",
  "04-system-prompts.js",
  "05-temperature.js",
  "06-response-streaming.js",
  "07-structured-data.js",
];

for (const file of files) {
  console.log(`\n${"=".repeat(60)}\n${file}\n${"=".repeat(60)}`);
  execFileSync("node", [path.join(__dirname, file)], { stdio: "inherit" });
}
