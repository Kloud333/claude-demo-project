<!--
  ЩО ЦЕ: Skill — папка з процедурою, яку Claude автоматично викликає,
  коли опис відповідає ситуації (тут: після завершення зміни коду).

  ЯК СТВОРИТИ: mkdir .claude/skills/<назва> + покласти skill.md всередину.
  Можна й попросити Claude самого згенерувати skill через розмову.

  ГОЛОВНЕ ПРАВИЛО: тримай skill.md ТОНКИМ. У контекст завантажується лише
  NAME + DESCRIPTION, поки skill реально не викликаний — тому можна
  "запакувати" скільки завгодно процедур без витрат контексту.
  Важкий матеріал → reference.md. Виконувані дії → check.sh (Claude
  ЗАПУСКАЄ скрипт, а не завантажує його вміст у контекст).
-->
---
name: verify-changes
description: >
  Use this skill automatically after any code refactor or feature
  implementation is complete, before declaring the task "done". Runs the
  test suite, reads the diff, and confirms no test was weakened just to
  pass. See reference.md for the full verification checklist.
---

# Verify Changes

When a code change is complete:

1. Run the test suite (`./check.sh` in this folder handles this).
2. Read the diff yourself — don't just trust a summary.
3. Confirm no test assertions were loosened or removed just to make things
   green.
4. Report **pass** or **fail**, with the evidence attached (test output,
   specific lines changed).

"Done" is NOT "the code looks right from the diff". "Done" is: the gates
were run and observed, with results stated explicitly.

For the full checklist and edge cases, see `@reference.md`.
