<!--
  ЩО ЦЕ: Skill — папка з процедурою, яку Claude автоматично викликає,
  коли description відповідає ситуації (тут: після завершення зміни коду).

  ⚠️ ВАЖЛИВО ПРО НАЗВУ ФАЙЛУ (з офіційного troubleshooting-гайду Skills):
  файл МАЄ називатись точно "SKILL.md" — великі літери SKILL, маленькі md.
  Це одна з найчастіших причин, чому skill "не завантажується" — назва
  файлу написана неправильно (skill.md, Skill.md тощо не спрацюють).
  Файл також ОБОВ'ЯЗКОВО має лежати всередині НАЗВАНОЇ директорії
  (.claude/skills/verify-changes/SKILL.md), а не в корені папки skills.

  ЯК СТВОРИТИ: mkdir .claude/skills/<назва> + покласти SKILL.md всередину.
  Можна й попросити Claude самого згенерувати skill через розмову.

  ГОЛОВНЕ ПРАВИЛО: тримай SKILL.md ТОНКИМ (< 500 рядків — принцип
  Progressive Disclosure). У контекст завантажується лише NAME + DESCRIPTION,
  поки skill реально не викликаний. Важкий матеріал → references/.
  Виконувані дії → scripts/ (Claude ЗАПУСКАЄ скрипт, а не завантажує його
  вміст у контекст).
-->
---
name: verify-changes
description: Use this skill automatically after any code refactor or feature implementation is complete, before declaring the task "done". Runs the test suite, reads the diff, and confirms no test was weakened just to pass. Trigger phrases include "is this done", "verify my changes", "check before I commit". See references/checklist.md for the full verification checklist.
allowed-tools: Read, Grep, Glob, Bash
model: sonnet
---

# Verify Changes

When a code change is complete:

1. Run the test suite (`scripts/check.sh` in this folder handles this —
   tell Claude to RUN it, not read its contents, to keep context efficient).
2. Read the diff yourself — don't just trust a summary.
3. Confirm no test assertions were loosened or removed just to make things
   green.
4. Report **pass** or **fail**, with the evidence attached (test output,
   specific lines changed).

"Done" is NOT "the code looks right from the diff". "Done" is: the gates
were run and observed, with results stated explicitly.

## Progressive disclosure

This is a short, high-level skill file. Deeper material lives in separate
files that Claude reads **only when needed**:

- **Only load when you need the full checklist and edge cases.** See
  [references/checklist.md](references/checklist.md) — covers weakened-test
  detection patterns and the exact reporting format.
