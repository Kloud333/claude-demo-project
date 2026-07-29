# 🧪 Claude Code Demo Project

Це навчальний тестовий проєкт — приклад структури `.claude` з усіма
компонентами, які вивчаються в курсах Anthropic (AI Fluency, Claude 101,
Claude Code in Action, Claude Code 101, Introduction to Agent Skills).

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
│   │   └── code-reviewer.md           # Subagent + приклад поля `skills:` (важлива деталь!)
│   ├── skills/                        # PROJECT-level skills (3-й рівень priority hierarchy)
│   │   ├── verify-changes/
│   │   │   ├── SKILL.md               # Тригер + опис + allowed-tools + model
│   │   │   ├── references/
│   │   │   │   └── checklist.md       # Progressive disclosure: детальний матеріал
│   │   │   └── scripts/
│   │   │       └── check.sh           # Виконуваний скрипт (не в контексті)
│   │   └── codebase-onboarding/
│   │       ├── SKILL.md               # Приклад multi-level progressive disclosure
│   │       ├── references/
│   │       │   ├── architecture-guide.md   # Level 2 — завантажується рідко
│   │       │   └── deep-dive-guide.md      # Level 3 — завантажується ще рідше
│   │       ├── scripts/
│   │       │   └── validate-env.sh
│   │       └── assets/
│   │           └── README.md          # Пояснення: сюди діаграми/шаблони/дані-файли
│   └── hooks/
│       ├── block-dangerous-commands.sh # PreToolUse: блокує небезпечні команди
│       └── format-after-edit.sh        # PostToolUse: авто-форматування
├── docs/
│   └── examples/                       # Референс-приклади (НЕ жива конфігурація)
│       ├── README.md                   # Пояснює, чому ці приклади не в .claude/
│       ├── personal-skill-pr-description/
│       │   └── SKILL.md                # Приклад PERSONAL skill (2-й рівень пріоритету)
│       └── enterprise-managed-settings.example.json  # Приклад ENTERPRISE settings (1-й рівень)
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

# 5. Створити skill (вручну або попросити Claude згенерувати)
mkdir -p .claude/skills/my-skill-name
# → покласти SKILL.md всередину (name + description у frontmatter)
# → ОБОВ'ЯЗКОВО перезапустити Claude Code, інакше skill не підхопиться

# 6. Створити custom slash-команду
mkdir -p .claude/commands
# → покласти .md файл у папку, перезапустити Claude Code

# 7. Додати MCP server
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
claude mcp add --transport stdio dev-utils -- python ./mcp-server/server.py

# 8. Налаштувати hooks через інтерактивне меню
/hooks
# → або редагувати .claude/settings.json напряму

# 9. Перевірити стан контексту й MCP
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

## 🧩 Skills: Priority Hierarchy

Коли назви skills конфліктують, перемагає той, що вищий у списку:

```
Enterprise  →  Personal  →  Project  →  Plugins
(найвищий)                              (найнижчий)
```

| Рівень | Де в цьому демо | Реальна локація |
|---|---|---|
| **Enterprise** | `docs/examples/enterprise-managed-settings.example.json` (референс) | Керується IT/admin, не в repo розробника |
| **Personal** | `docs/examples/personal-skill-pr-description/` (референс) | `~/.claude/skills/` — слідує за тобою по всіх проєктах |
| **Project** | `.claude/skills/verify-changes/`, `.claude/skills/codebase-onboarding/` | Цей repo — реально активна конфігурація |
| **Plugins** | `.claude-plugin/plugin.json` | Встановлені через marketplace |

> ⚠️ **Subagents НЕ бачать skills автоматично!** Дивись коментар у
> `.claude/agents/code-reviewer.md` — потрібне явне поле `skills:`.

### Skills Validator
Перед тим, як ділитись skill з командою — прожени через **agent skills validator** (встановлюється легше за все через `uv`). Ловить структурні проблеми (неправильна назва файлу, відсутня директорія тощо) до того, як витрачати час на дебаг.

```bash
claude --debug   # покаже помилки завантаження skills/hooks/MCP
```

---

## 🔑 Ключові команди для щоденної роботи (шпаргалка)

| Команда | Що робить |
|---|---|
| `/init` | Аналізує кодбазу, генерує CLAUDE.md |
| `/agents` | Створити/редагувати subagents |
| `/hooks` | Налаштувати hooks через меню |
| `mkdir .claude/skills/<name>` + `SKILL.md` | Створити skill (потрібен рестарт після створення/зміни!) |
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

- **CLAUDE.md, hooks, MCP, subagents (базово)** — Claude Code in Action + Claude Code 101
- **Permission modes** — Claude Code in Action → Permission Modes
- **Skills: SKILL.md формат, allowed-tools, progressive disclosure, priority hierarchy, skills+subagents** — Introduction to Agent Skills
- **4D Framework (Delegation/Description/Discernment/Diligence)** — AI Fluency: Framework & Foundations
