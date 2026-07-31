# 🧩 MCP Server Demo (JS)

Робочий MCP server на офіційному **JS/Node SDK** (`@modelcontextprotocol/sdk`)
— практична частина курсу **"Introduction to Model Context Protocol"**,
переписана з Python на JS. Реалізує **усі три примітиви MCP**: Tools,
Resources, Prompts — показує, що MCP не прив'язаний до конкретної мови
(офіційні SDK є і для TypeScript/Node.js, PHP, Go, C#, Kotlin, Ruby,
Rust, Swift).

**Важлива відмінність від решти цього репо:** `.claude/` — ілюстративна
конфігурація *Claude Code* (як з нею працювати). Ця папка — інша
категорія: приклад того, **як самому побудувати MCP server**.

## 📁 Файли

| Файл | Що робить |
|---|---|
| `server.js` | MCP server "DocumentMCP" — усі 3 примітиви (tools, resources, prompts) |
| `test-client.js` | Автономний test-клієнт: перевіряє всі примітиви без браузера |

## 🧠 Що таке кожен примітив — коротко

MCP визначає три "будівельні блоки", і головне, чим вони відрізняються —
**хто вирішує, коли їх використати**:

| Примітив | Хто вирішує | В нашому сервері | Навіщо |
|---|---|---|---|
| **Tools** | **Claude** (сам викликає, коли треба) | `read_doc_contents`, `edit_document` | Дати Claude дію, яку він виконує автономно |
| **Resources** | **Застосунок** (наш код вирішує, коли підтягнути) | `docs://documents` (список), `docs://documents/{doc_id}` (вміст) | Дані для UI (автокомпліт `@`) або контекст, що інжектиться в промпт без tool call |
| **Prompts** | **Юзер** (сам запускає дію) | `/format`, `/summarize` | Готовий, протестований workflow за командою (`/`), а не написаний юзером з нуля |

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
Перевіряє все підряд: tools (read → edit → read, підтверджує збереження
state), resources (список документів + вміст конкретного), prompts
(`format` з підставленим `doc_id`).

**Варіант 2 — MCP Inspector (візуально, як у курсі):**
```bash
npm run mcp:inspect
```
Відкриє браузерний UI (аналог `mcp dev` з Python-версії курсу). Вкладки
**Tools / Resources / Prompts** — все реалізоване видно й тестується руками.

**Варіант 3 — підключити до Claude Code:**
Сервер уже прописаний у `.mcp.json` як `document-mcp`. Запусти `claude`
в цій директорії (`/mcp` — перевірити підключення), і можна одразу
попросити Claude щось із документами — Claude сам вирішить, чи потрібен
tool.

## 🔀 Порівняння з Python-версією курсу

| | Python (курс, `cli_project`) | JS (тут) |
|---|---|---|
| SDK | `mcp[cli]` (`FastMCP`) | `@modelcontextprotocol/sdk` (`McpServer`) |
| Tool | `@mcp.tool(...)` + `Field(description=...)` | `server.registerTool(name, config, cb)` + zod |
| Resource (direct) | `@mcp.resource("docs://documents")` | `server.registerResource(name, uri, config, cb)` |
| Resource (templated) | `@mcp.resource("docs://documents/{doc_id}")` | `server.registerResource(name, new ResourceTemplate(...), config, cb)` |
| Prompt | `@mcp.prompt(...)` → `list[base.Message]` | `server.registerPrompt(name, config, cb)` → `{ messages: [...] }` |
| Валідація аргументів | Pydantic `Field` | `zod` |

Логіка identична — різниться тільки синтаксис мови.

## 📌 Статус реалізації

- [x] Tools: `read_doc_contents`, `edit_document`
- [x] Resources: `docs://documents` (direct), `docs://documents/{doc_id}` (templated)
- [x] Prompts: `format` (переформатувати в markdown), `summarize` (підсумувати)

**Реалізацію завершено** — усі три примітиви MCP присутні й перевірені
(`npm run mcp:test` проходить чисто).
