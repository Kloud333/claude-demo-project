<!--
  ЩО ЦЕ: Custom slash-команда. Файл audit.md в .claude/commands/
  автоматично стає командою /audit всередині Claude Code.

  ЯК СТВОРИТИ: покласти .md файл у .claude/commands/, ПЕРЕЗАПУСТИТИ
  Claude Code (нові команди не підхоплюються без рестарту).

  АРГУМЕНТИ: використовуй $arguments у тексті нижче, щоб команда приймала
  runtime-параметр. Приклад виклику: /audit src/api
-->

Perform a dependency and security audit of the project (or a specific
directory if given: $arguments).

Steps:
1. Run `npm audit` and summarize any high/critical vulnerabilities.
2. Check for outdated dependencies with `npm outdated`.
3. Scan the target directory for hardcoded secrets or API keys
   (patterns like `sk_live_`, `api_key =`, `.env` values committed to git).
4. Report findings as a short prioritized list — critical issues first.

Do not attempt to fix anything automatically. Only report.
