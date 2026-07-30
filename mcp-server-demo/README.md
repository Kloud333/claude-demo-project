# 🧩 MCP Server Demo (JS)

Робочий MCP server на офіційному **JS/Node SDK** (`@modelcontextprotocol/sdk`)
— практична частина курсу **"Introduction to Model Context Protocol"**,
переписана з Python на JS. Показує, що MCP — протокол, не прив'язаний
до конкретної мови (офіційні SDK є і для TypeScript/Node.js, PHP, Go,
C#, Kotlin, Ruby, Rust, Swift).

**Важлива відмінність від решти цього репо:** `.claude/` — ілюстративна
конфігурація *Claude Code* (як з нею працювати). Ця папка — інша
категорія: приклад того, **як самому побудувати MCP server**.

## 📁 Файли

| Файл | Що робить |
|---|---|
| `server.js` | MCP server "DocumentMCP" — tools для читання/редагування документів у пам'яті |
| `test-client.js` | Автономний test-клієнт: підключається до `server.js`, викликає tools, перевіряє результат — без браузера |

## 🚀 Setup

```bash
# з кореня проєкту (claude-demo-project/)
npm install
```

## ▶️ Як перевірити, що працює

**Варіант 1 — автоматичний test-скрипт (швидко, без браузера):**
```bash
npm run mcp:test
```
Виведе список tools, прочитає документ, відредагує його, прочитає знову —
і покаже, що зміна застосувалась (state зберігається між викликами).

**Варіант 2 — MCP Inspector (візуально, як у курсі):**
```bash
npm run mcp:inspect
```
Відкриє браузерний UI (аналог `mcp dev` з Python-версії курсу) — можна
руками потестувати `read_doc_contents` і `edit_document`.

**Варіант 3 — підключити до Claude Code:**
Сервер уже прописаний у `.mcp.json` як `document-mcp`. Після `npm install`
у корені проєкту — просто запусти `claude` в цій директорії, і сервер
підключиться автоматично (перевір через `/mcp` всередині Claude Code).

## 🔀 Порівняння з Python-версією курсу

| | Python (курс, `cli_project`) | JS (тут) |
|---|---|---|
| SDK | `mcp[cli]` (`FastMCP`) | `@modelcontextprotocol/sdk` (`McpServer`) |
| Tool-декоратор | `@mcp.tool(...)` + `Field(description=...)` | `server.registerTool(name, config, cb)` + zod-схема |
| Валідація аргументів | Pydantic `Field` | `zod` |
| Transport (цей приклад) | stdio | stdio |

Логіка identична — різниться тільки синтаксис мови.

## 📌 Статус реалізації

- [x] Tools: `read_doc_contents`, `edit_document`
- [ ] Resources (список doc id's + вміст конкретного doc) — після
      модуля "Defining resources" / "Accessing resources"
- [ ] Prompts (reformat в markdown, summarize) — після модуля
      "Defining prompts"

> 💡 Реалізація навмисно поступова — синхронно з проходженням курсу,
> так само, як росте Python starter-проєкт (`cli_project`).
