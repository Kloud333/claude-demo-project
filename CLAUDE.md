<!--
  ЩО ЦЕ: CLAUDE.md — персистентна "пам'ять" проєкту.
  Claude Code читає цей файл АВТОМАТИЧНО на початку кожної сесії.
  Вміст файлу додається до кожного твого промпту (як system prompt).

  ЯК СТВОРИТИ: команда `/init` всередині Claude Code — аналізує кодбазу
  і генерує цей файл автоматично. Або створи вручну.

  ГОЛОВНЕ ПРАВИЛО: тримай файл ТОНКИМ. Кожен рядок конкурує за увагу
  Claude з іншими рядками. Довгий файл = Claude гірше виконує будь-яке
  окреме правило. Записуй тільки те, без чого Claude постійно помиляється.

  ⚠️ М'які конвенції → сюди.
  ⚠️ Тверді правила, які НЕ можна порушувати (напр. "ніколи не push в main")
     → в hooks (.claude/hooks/), а не сюди! CLAUDE.md — це прохання,
     не гарантія.
-->

# Project

Демонстраційний Node.js-проєкт для практики Claude Code. Express API +
проста фронтова частина.

# Commands

<!-- Claude використовує ці команди сам, коли треба щось перевірити -->
- Dev server: `npm run dev`
- Run tests: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`

# Code Style

<!--
  ПРИКЛАД конкретного, перевірюваного правила (добре):
  "Put new API routes in src/api/handlers, one per file"

  ПРИКЛАД розмитого правила (погано, Claude не зможе перевірити):
  "Follow best practices"
-->
- Use 2-space indentation
- Prefer named exports, not default exports
- Put new API routes in `src/api/handlers`, one file per route
- Use server actions instead of API routes where possible

# Architecture

- `src/` — вихідний код застосунку
- `.claude/` — конфігурація Claude Code (hooks, skills, subagents, команди)

# Database Schema

<!--
  ПРИКЛАД використання @ для постійного контексту:
  вміст файлу нижче автоматично підтягується в КОЖЕН запит,
  Claude не читає й не шукає його щоразу заново.

  Розкоментуй, якщо у проєкті реально є цей файл:
  The database schema is defined in @prisma/schema.prisma.
  Reference it anytime you need to understand data structure.
-->

# Important Rules

**IMPORTANT**: Run the test suite EVERY TIME before considering a task done.

<!--
  Emphasis — це бюджет! IMPORTANT/YOU MUST мають сенс, тільки якщо
  використовуються рідко (2-3 найкритичніші правила). Якщо кричить
  кожен рядок — емфаза втрачає сенс.
-->

# External Docs

<!-- Приклад інтеграції з AGENTS.md іншого інструменту (якщо є в репо) -->
<!-- @AGENTS.md -->

<!-- Приклад посилання на README для довідки -->
Please read if you need more info: @README.md
