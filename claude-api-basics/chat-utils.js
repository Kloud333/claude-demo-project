// Спільні helper-функції для всіх прикладів у цій папці.
// Курс "Building with the Claude API" будує їх поступово — тут усе
// вже зібрано разом, з усіма фіксами, які знайшли на практиці.

const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();
const model = "claude-sonnet-5";

function addUserMessage(messages, text) {
  messages.push({ role: "user", content: text });
}

function addAssistantMessage(messages, text) {
  // Також використовується для pre-filling (див. 07-structured-data.js) —
  // ⚠️ Claude Sonnet 5 НЕ підтримує prefill (розмова має закінчуватись
  // user-повідомленням). Для prefill-прикладів використовуй modelOverride.
  messages.push({ role: "assistant", content: text });
}

/**
 * Шле messages до Claude, повертає текст відповіді. Усі опції — опціональні,
 * додаються в запит тільки якщо реально задані.
 *
 * ⚠️ Claude Sonnet 5 (модель за замовчуванням тут) має 2 обмеження:
 *  - temperature повністю деприкейтений — будь-яке значення кидає 400
 *  - assistant message prefill не підтримується — теж 400
 * Обхід для обох: modelOverride: "claude-sonnet-4-5-20250929" (старша
 * модель, що ще підтримує обидва). Для temperature є й сучасніший підхід —
 * просто не використовувати цей параметр на нових моделях.
 */
async function chat(messages, options = {}) {
  const { system, temperature, stopSequences, outputConfig, modelOverride } = options;

  const params = {
    model: modelOverride || model,
    max_tokens: 1000,
    messages,
  };
  if (system) params.system = system;
  if (temperature !== undefined) params.temperature = temperature;
  if (stopSequences) params.stop_sequences = stopSequences;
  if (outputConfig) params.output_config = outputConfig;

  const message = await client.messages.create(params);

  // ⚠️ Claude Sonnet 5 має adaptive thinking увімкнений за замовчуванням —
  // content може містити ThinkingBlock (без .text) ПЕРЕД TextBlock.
  // Тому шукаємо текстовий блок за type, а не беремо content[0] наосліп.
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock) {
    throw new Error(`No text block found in response: ${JSON.stringify(message.content)}`);
  }
  return textBlock.text;
}

module.exports = { client, model, addUserMessage, addAssistantMessage, chat };
