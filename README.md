# 🧪 Claude Code Demo Project

Це навчальний тестовий проєкт — приклад структури `.claude` з усіма
компонентами, які вивчаються в курсах Anthropic (AI Fluency, Claude 101,
Claude Code in Action, Claude Code 101).

**Мета:** мати робочий приклад під рукою — щоб завжди можна було глянути,
де що створюється, як виглядає конфіг, і які команди треба виконати,
щоб отримати те саме у власному проєкті.

Кожен файл містить коментарі: **що це**, **навіщо**, і **якою командою
це створюється** в реальному Claude Code.

---

## 📁 Структура проєкту

```
claude-demo-project/
├── LICENSE                            # MIT — для публічного репо
├── package.json                       # Щоб npm-команди з CLAUDE.md реально працювали
├── CLAUDE.md                          # Персистентна пам'ять проєкту
├── CLAUDE.local.md                    # Особисті нотатки (в реальному проєкті — не в git; тут видимий як приклад)
├── .gitignore                         # Правило для local-файлів навмисно закоментоване (демо)
├── .mcp.json                          # MCP servers на рівні проєкту
├── .github/
│   └── workflows/
│       └── claude.yaml                # GitHub Action: @claude mentions у PR/issues
├── .claude-plugin/
│   └── plugin.json                    # Опційний manifest — пакування .claude як plugin
├── .claude/
│   ├── settings.json                  # Permission mode + hooks (в git)
│   ├── settings.local.json            # Особисті permission override (в реальному проєкті — не в git; тут видимий як приклад)
│   ├── commands/
│   │   └── audit.md                   # Custom slash-команда /audit
│   ├── agents/
│   │   └── code-reviewer.md           # Subagent для рев'ю коду
│   ├── skills/
│   │   └── verify-changes/
│   │       ├── skill.md               # Тригер + опис skill
│   │       ├── reference.md           # Детальний довідковий матеріал
│   │       └── check.sh               # Виконуваний скрипт (не в контексті)
│   └── hooks/
│       ├── block-dangerous-commands.sh # PreToolUse: блокує небезпечні команди
│       └── format-after-edit.sh        # PostToolUse: авто-форматування
└── src/
    └── example.js                      # Приклад вихідного коду проєкту
```

---

## 🚀 Як відтворити цю структуру в реальному проєкті — з нуля

```bash
# 1. Встановити Claude Code (якщо ще не встановлено)
curl -fsSL https://claude.ai/install.sh | bash        # macOS/Linux/WSL
# irm https://claude.ai/install.ps1 | iex              # Windows PowerShell

# 2. Перейти в директорію проєкту і запустити Claude Code
cd my-project
claude

# 3. Згенерувати CLAUDE.md автоматичним аналізом кодбази
/init

# 4. Створити subagent через інтерактивний майстер
/agents
# → "Create new agent" → обрати scope/tools/опис

# 5. Створити custom slash-команду
mkdir -p .claude/commands
# → покласти .md файл у папку, перезапустити Claude Code

# 6. Додати MCP server
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
claude mcp add --transport stdio dev-utils -- python ./mcp-server/server.py

# 7. Налаштувати hooks через інтерактивне меню
/hooks
# → або редагувати .claude/settings.json напряму

# 8. Перевірити стан контексту й MCP
/context
/mcp
```

---

## 📤 Публікація на GitHub (щоб ділитись проєктом)

```bash
cd claude-demo-project

# 1. Ініціалізувати git-репо
git init
git add .
git commit -m "Initial commit: Claude Code config demo"

# 2. Створити репо на GitHub (через сайт, або GitHub CLI)
gh repo create claude-demo-project --public --source=. --remote=origin

# 3. Запушити
git push -u origin main
```

**Щоб `.github/workflows/claude.yaml` реально запрацював** після пушу:
1. У Settings репозиторію → Secrets and variables → Actions → додати
   `ANTHROPIC_API_KEY`
2. Або простіше: всередині Claude Code виконати `/install-github-app` —
   він сам налаштує все за тебе (потрібні права repo admin)

**Щоб команда могла встановити `.claude/` як plugin** (замість copy-paste
файлів вручну):
```bash
/plugin marketplace add your-org/claude-plugins   # одноразово для команди
/plugin install your-org@claude-demo-project-plugin
```

> 💡 Перед тим, як ділитись репо публічно — переглянь `.claude/hooks/*.sh`
> і `.claude/settings.json`: hooks виконують код з твоїми привілеями на
> машині кожного, хто їх встановить. Це та сама пересторога, що й для
> будь-якого стороннього plugin — "read before you install".

> ⚠️ **Про `.gitignore`**: у цьому демо правило для `CLAUDE.local.md` і
> `settings.local.json` навмисно **закоментоване** — щоб ці файли були
> видимі на GitHub як приклад. Якщо форкаєш проєкт для реальної роботи —
> розкоментуй ці два рядки в `.gitignore`, інакше особисті нотатки й
> permission-override підуть у спільну історію команди.

---

## 🔑 Ключові команди для щоденної роботи (шпаргалка)

| Команда | Що робить |
|---|---|
| `/init` | Аналізує кодбазу, генерує CLAUDE.md |
| `/agents` | Створити/редагувати subagents |
| `/hooks` | Налаштувати hooks через меню |
| `/mcp` | Керування MCP-серверами |
| `/context` | Показати використання context window |
| `/compact [інструкція]` | Стиснути розмову, зберігши вказане |
| `/clear` | Почати розмову з чистого аркуша |
| `/plan` | Увімкнути Plan Mode (read-only дослідження + план) |
| `/effort` | Показати/змінити рівень reasoning (low → max) |
| `/rewind` | Відкотитись до попереднього checkpoint |
| `/goal <умова>` | Автономна робота до виконання умови |
| `/commit-push-pr` | Commit + push + створення PR в один крок |
| `Shift+Tab` | Цикл між permission modes |
| `Ctrl+V` | Вставити скріншот у промпт |

---

## 📚 З якого курсу що взято

- **CLAUDE.md, hooks, skills, MCP, subagents** — Claude Code in Action + Claude Code 101
- **Permission modes** — Claude Code in Action → Permission Modes
- **4D Framework (Delegation/Description/Discernment/Diligence)** — AI Fluency: Framework & Foundations
