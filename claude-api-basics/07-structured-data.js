// Модуль курсу: Structured Data (+ Structured Data Exercise)
// Prefill + stop sequences → чистий JSON/код без markdown-обгортки
// й пояснень "від себе".
//
// ⚠️ Claude Sonnet 5 НЕ підтримує assistant message prefill — тому
// prefill-приклади нижче явно використовують modelOverride на модель,
// яка ще підтримує (claude-sonnet-4-5-20250929). Для Sonnet 5 напряму —
// сучасна заміна output_config (приклад в кінці файлу).

require("dotenv").config();
const { addUserMessage, addAssistantMessage, chat } = require("./chat-utils");

const PREFILL_MODEL = "claude-sonnet-4-5-20250929";

async function messyOutput() {
  console.log("=== Без техніки — типова 'брудна' відповідь ===");
  const messages = [];
  addUserMessage(messages, "Generate a very short event bridge rule as json");
  console.log(await chat(messages));
}

async function prefillAndStop() {
  console.log("\n=== Prefill + stop sequence — чистий JSON ===");
  const messages = [];
  addUserMessage(messages, "Generate a very short event bridge rule as json");
  addAssistantMessage(messages, "```json"); // pre-fill

  const text = await chat(messages, { stopSequences: ["```"], modelOverride: PREFILL_MODEL });
  console.log(JSON.stringify(text)); // показує \n символи явно

  const cleanJson = JSON.parse(text.trim());
  console.log("Parsed:", cleanJson);
}

async function prefillTrapAndFix() {
  // ➕ Structured Data Exercise (з відео): 3 AWS CLI команди в ОДНІЙ
  // відповіді, без коментарів — тільки prefill + stop sequences.
  console.log("\n=== Exercise: пастка наївного prefill ===");
  const prompt = "\nGenerate three different sample AWS CLI commands. Each should be very short.\n";

  const messagesNaive = [];
  addUserMessage(messagesNaive, prompt);
  addAssistantMessage(messagesNaive, "Here are all three commands ```bash");
  const naive = await chat(messagesNaive, { stopSequences: ["```"], modelOverride: PREFILL_MODEL });
  console.log("Наївний prefill (⚠️ ймовірно лише ОДНА команда):", JSON.stringify(naive.trim()));

  console.log("\n=== Exercise: рішення — детальніший prefill ===");
  // 🔑 Ключовий інсайт: prefill не обмежений коротким delimiter'ом —
  // можна вкласти туди повноцінну інструкцію, Claude "думає", що сам
  // це написав, і дотримується рамки сильніше, ніж system prompt.
  const messagesFixed = [];
  addUserMessage(messagesFixed, prompt);
  addAssistantMessage(
    messagesFixed,
    "Here are all three commands in a single block without any comments:\n```bash"
  );
  const fixed = await chat(messagesFixed, { stopSequences: ["```"], modelOverride: PREFILL_MODEL });
  console.log("Детальний prefill (усі 3 команди):", fixed.trim());
}

async function modernOutputConfig() {
  // ➕ Сучасна заміна prefill для Claude Sonnet 5 напряму — output_config,
  // schema-validated JSON, гарантований результат, без 400-помилок.
  console.log("\n=== output_config — сучасний спосіб, працює на Sonnet 5 напряму ===");

  // ⚠️ schema вимагає "additionalProperties": false НА КОЖНОМУ object-рівні
  // (і верхньому, і вкладених) — інакше 400.
  const outputConfig = {
    format: {
      type: "json_schema",
      schema: {
        type: "object",
        properties: {
          source: { type: "array", items: { type: "string" } },
          "detail-type": { type: "array", items: { type: "string" } },
          detail: {
            type: "object",
            properties: { state: { type: "array", items: { type: "string" } } },
            required: ["state"],
            additionalProperties: false,
          },
        },
        required: ["source", "detail-type", "detail"],
        additionalProperties: false,
      },
    },
  };

  const messages = [];
  addUserMessage(messages, "Generate a very short event bridge rule as json");
  const text = await chat(messages, { outputConfig }); // без prefill, без stopSequences, дефолтна Sonnet 5
  console.log(text);
  console.log("Parsed:", JSON.parse(text));
}

async function main() {
  await messyOutput();
  await prefillAndStop();
  await prefillTrapAndFix();
  await modernOutputConfig();
}

main().catch(console.error);
