# ✅ MCP Todo Example — другий, мінімальний приклад

Компактний, самодостатній приклад MCP-сервера й клієнта — окремо від
`mcp-server-demo/` (документи), навмисно **простіша тема** (todo-список),
щоб уся увага була на MCP-логіці, а не на предметній області.

## 📁 Файли (уся структура з курсу, в одному місці)

| Файл | Що це | Звідки в курсі |
|---|---|---|
| `server.js` | MCP server: 2 tools, 2 resources, 1 prompt | Defining tools / resources / prompts |
| `client.js` | **Власний клас** `TodoMCPClient` — обгортка над Client Session | Implementing a client |
| `demo.js` | Наскрізний сценарій: використовує client, щоб показати все в дії | — |

**Чому тут є окремий `client.js`, а в `mcp-server-demo/` — ні:** у першому
прикладі client-логіка не виносилась у власний клас (SDK використовувався
напряму). Тут — навмисно, точний аналог курсового `MCPClient`
(`connect()` → `session()` → `listTools()/callTool()/...`), щоб приклад
демонстрував **повну** архітектуру: наш Client клас → Client Session
(SDK) → MCP Server.

## 🧠 Що всередині — по одному реченню на кожне

- **`add_todo(text)` / `complete_todo(id)`** — tools, Claude сам вирішує, коли їх викликати
- **`todos://all`** — direct resource, весь список одразу (JSON)
- **`todos://{id}`** — templated resource, один todo за id
- **`plan_day`** — prompt **без аргументів** (на відміну від document-прикладу — показує, що параметри опціональні)

## ▶️ Запуск

```bash
# з кореня проєкту (claude-demo-project/), якщо ще не робив npm install
npm install

npm run todo:demo       # наскрізний сценарій у консолі — найшвидший спосіб побачити все
npm run todo:inspect    # MCP Inspector (браузер) — ручне тестування
```

`npm run todo:demo` виводить: список tools/resources/prompts → додає 2
todo → позначає один виконаним → читає обидва resources → отримує
`plan_day` prompt. Усе одним прогоном, без браузера.

### ⚠️ Дрібні нюанси, щоб не збивали з пантелику
- Є ще `npm run todo:server` — запускає **тільки сервер**, без клієнта. Якщо запустиш його напряму, термінал "зависне" й нічого не виведе — **це нормально**: сервер чекає на stdio-клієнта, а не на людину в терміналі. Використовується під капотом в `todo:inspect`; сам по собі окремо не потрібен.
- При **першому** запуску `npm run todo:inspect` `npx` попросить підтвердити встановлення пакету `@modelcontextprotocol/inspector` (`Ok to proceed? (y)`) — тисни `y`, це одноразово, далі кешується.
- На Windows після завершення `todo:demo` може з'явитись `Exception ignored ... I/O operation on closed pipe` — нешкідливий quirk `asyncio`-подібної stdio-очистки в Node на Windows, з'являється **після** того, як реальний результат уже надрукований. Безпечно ігнорувати (той самий випадок, що й у `mcp-server-demo/`).
