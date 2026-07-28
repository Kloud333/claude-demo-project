#!/usr/bin/env bash
#
# ЩО ЦЕ: PreToolUse hook. Спрацьовує ДО того, як Claude виконає Bash-команду.
# Може ЗАБЛОКУВАТИ виклик — на відміну від CLAUDE.md-інструкції ("зазвичай
# слухає"), hook — ГАРАНТІЯ ("завжди спрацьовує").
#
# ЯК ПІДКЛЮЧИТИ: прописано в .claude/settings.json під PreToolUse + matcher "Bash"
#
# ЯК ПРАЦЮЄ:
#   1. Claude Code передає JSON з деталями виклику через stdin
#      (tool_name, tool_input.command, session_id, ...)
#   2. Скрипт перевіряє команду на небезпечні патерни
#   3. exit 0 = дозволити, exit 2 = заблокувати (stderr стає фідбеком для Claude)
#   4. exit 1 НЕ БЛОКУЄ — це поширена пастка! Тільки exit 2 зупиняє дію.

# Читаємо JSON з stdin
INPUT=$(cat)

# Витягуємо саму команду (спрощено, без jq — у реальному проєкті краще jq)
COMMAND=$(echo "$INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"command"[[:space:]]*:[[:space:]]*"//;s/"$//')

# --- Список небезпечних патернів ---
# Приклад із курсу: force push, rm -rf, комміт напряму в main
if echo "$COMMAND" | grep -qE '(rm -rf|git push.*--force|git push.*origin main)'; then
  echo "🚫 Заблоковано: команда '$COMMAND' відповідає забороненому патерну (destructive/force operation)." >&2
  exit 2   # <- КРИТИЧНО: саме 2, не 1! Тільки exit 2 блокує PreToolUse.
fi

# Все ок — дозволяємо виконання
exit 0
