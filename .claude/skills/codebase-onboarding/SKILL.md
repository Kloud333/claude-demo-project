<!--
  ЩО ЦЕ: другий приклад skill — демонструє те, чого немає у verify-changes:
    1) allowed-tools, що ОБМЕЖУЄ Claude лише read-only діями (security)
    2) Progressive Disclosure на кілька РІВНІВ (не один reference-файл,
       а декілька, кожен зі своїм тригером завантаження)

  ⚠️ allowed-tools: Read, Grep, Glob, Bash — Claude, поки цей skill
  активний, може ТІЛЬКИ читати й досліджувати, жодного редагування чи
  запису. Якщо поле пропустити — обмежень нема, звичайна permission model.
-->
---
name: codebase-onboarding
description: Helps new developers understand how this system works — architecture, data flow, where to add new features. Use when someone asks "how does this work", "where should I add X", "explain the architecture", or is onboarding to the project for the first time.
allowed-tools: Read, Grep, Glob, Bash
model: sonnet
---

# Codebase Onboarding

## Level 1: Quick orientation (always loaded)

This is a small Node.js demo project:
- `src/` — application source code
- `.claude/` — Claude Code configuration (this skill lives here!)

For most "where is X" questions, a quick `grep`/`glob` in `src/` is enough
— don't load the deeper reference files below unless the question is
actually about architecture or historical decisions.

## Progressive Disclosure Levels

### Level 2: Architecture Overview
**Only load when user requests more detail about system design.** See
[references/architecture-guide.md](references/architecture-guide.md).

Covers:
- Directory structure and purpose of each folder
- Architectural pattern (MVC, REST API, microservices, etc.)
- Data flow from request to response

### Level 3: Deep Dives
**Only load when user requests a specific topic.** See
[references/deep-dive-guide.md](references/deep-dive-guide.md).

Covers historical "why" decisions that don't matter for day-to-day work
but matter when someone asks "why is it built this way".

## Environment Validation

If someone asks "is my environment set up correctly", **run**
`scripts/validate-env.sh` (don't read its contents — just execute it and
report the output). This keeps the check consistent and out of context.

## Assets

Supporting non-text files (diagrams, templates) live in `assets/` — the
third Progressive Disclosure folder alongside `scripts/` and
`references/`. See [assets/README.md](assets/README.md) for what belongs
there.
