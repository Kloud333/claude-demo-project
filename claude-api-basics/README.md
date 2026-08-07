# 🤖 Claude API Basics (JS)

Основи роботи з Claude API — практична частина курсу **"Building with
the Claude API"**, перенесена з Python/Jupyter на звичайний JS (Node.js),
щоб бути частиною цього репо. Кожен файл — окрема тема, запускається
напряму через `node`, без Jupyter чи будь-якого спеціального середовища.

## 📁 Файли

| Файл | Тема курсу | Що показує |
|---|---|---|
| `chat-utils.js` | — | Спільні helper-функції для всіх прикладів |
| `01-making-a-request.js` | Accessing the API / Making a Request | Перший "сирий" запит, розбір відповіді |
| `02-multi-turn-conversations.js` | Multi-Turn Conversations | Чому Claude "забуває" контекст, і як це виправити |
| `03-chat-exercise.js` | Chat Exercise | Живий інтерактивний чат у терміналі |
| `04-system-prompts.js` | System Prompts (+ exercise) | Керування тоном/роллю Claude + стилем коду |
| `05-temperature.js` | Temperature | Детерміновано vs креативно |
| `06-response-streaming.js` | Response Streaming | Текст шматками замість очікування |
| `07-structured-data.js` | Structured Data (+ exercise) | Чистий JSON без markdown-обгортки |
| `run-all.js` | — | Прогін усіх (крім чату) поспіль |

## 🧠 Найцінніше тут — не сам курс, а що змінилось відтоді

Курс записаний на старішій моделі. **Claude Sonnet 5** (яку тут
використовуємо за замовчуванням) поводиться інакше в трьох місцях —
кожен файл, де це стосується, має явний ⚠️-коментар:

| Що зламалось | Чому | Де фікс |
|---|---|---|
| `content[0].text` іноді падає | Adaptive thinking увімкнений за замовчуванням — `content[0]` може бути `ThinkingBlock` без `.text` | `chat-utils.js`: шукаємо блок за `type === "text"` |
| `temperature` кидає 400 (будь-яке значення) | Повністю деприкейтений для моделей новіших за Opus 4.6 | `05-temperature.js`: `modelOverride` на старшу модель |
| Assistant prefill кидає 400 | Не підтримується — розмова має закінчуватись `user` message | `07-structured-data.js`: `modelOverride` **або** сучасний `output_config` |

## 🚀 Setup

```bash
# з кореня проєкту (claude-demo-project/)
npm install
```
Ключ — у `claude-api-basics/.env` (скопіюй з `.env.example`).

## ▶️ Запуск

```bash
npm run api:request      # 01 — перший запит
npm run api:multiturn    # 02 — multi-turn
npm run api:chat         # 03 — живий чат (інтерактивний!)
npm run api:system       # 04 — system prompts
npm run api:temperature  # 05 — temperature
npm run api:streaming    # 06 — streaming
npm run api:structured   # 07 — structured data
npm run api:all          # усе поспіль, крім чату (03)
```

Кожен файл також можна запустити напряму: `node claude-api-basics/01-making-a-request.js`.

> 💡 `03-chat-exercise.js` — єдиний інтерактивний файл (живий діалог у
> терміналі, вихід — команда `exit`). Не входить у `api:all`, бо чекає
> вводу користувача.
