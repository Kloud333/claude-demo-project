#!/usr/bin/env bash
#
# ЩО ЦЕ: PostToolUse hook. Спрацьовує ПІСЛЯ того, як Claude відредагував
# файл (Edit/MultiEdit/Write). Класичний use case з курсу — авто-форматування.
#
# ЯК ПІДКЛЮЧИТИ: прописано в .claude/settings.json під PostToolUse +
# matcher "Edit|MultiEdit|Write"
#
# ВАЖЛИВО: PostToolUse спрацьовує ПІСЛЯ виконання tool — заблокувати вже
# пізно (файл вже змінено). Але можна повернути feedback-текст назад Claude.

INPUT=$(cat)

# Витягуємо шлях відредагованого файлу
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//;s/"$//')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Обираємо форматер за розширенням файлу
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx)
    echo "→ (демо) тут запустився б: npx prettier --write \"$FILE_PATH\""
    ;;
  *.go)
    echo "→ (демо) тут запустився б: gofmt -w \"$FILE_PATH\""
    ;;
  *.py)
    echo "→ (демо) тут запустився б: black \"$FILE_PATH\""
    ;;
  *)
    exit 0
    ;;
esac

exit 0
