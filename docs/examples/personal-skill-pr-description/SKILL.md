<!--
  ⚠️ ЦЕ РЕФЕРЕНС-ПРИКЛАД, НЕ ЖИВА КОНФІГУРАЦІЯ.
  У реальності цей файл жив би за шляхом:
    ~/.claude/skills/pr-description/SKILL.md   (macOS/Linux/WSL)
    C:/Users/<user>/.claude/skills/pr-description/SKILL.md   (Windows)

  Це PERSONAL skill (другий рівень priority hierarchy: Enterprise →
  PERSONAL → Project → Plugins) — слідує за тобою по ВСІХ проєктах,
  а не тільки цьому repo. Тому він логічно НЕ повинен лежати в
  .claude/skills/ цього конкретного repo (там був би Project-level skill).

  ЯК СТВОРИТИ РЕАЛЬНО:
    mkdir -p ~/.claude/skills/pr-description
    # потім створити SKILL.md всередині з вмістом нижче
    # ОБОВ'ЯЗКОВО рестарт Claude Code після створення
-->
---
name: pr-description
description: Writes pull request descriptions. Use when creating a PR, writing a PR, or when the user asks to summarize changes for a pull request.
---

When writing a PR description:

1. Run `git diff main...HEAD` to see all changes on this branch
2. Write a description following this format:

## What
One sentence explaining what this PR does.

## Why
Brief context on why this change is needed

## Changes
- Bullet points of specific changes made
- Group related changes together
- Mention any files deleted or renamed
