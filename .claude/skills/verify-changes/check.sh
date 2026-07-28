#!/usr/bin/env bash
#
# ЩО ЦЕ: виконуваний скрипт всередині skill-папки. Claude ЗАПУСКАЄ його
# (bash check.sh), а не завантажує вміст файлу в контекст — так skill
# може "нести" з собою власний тулінг без витрат context window.
#
# У РЕАЛЬНОМУ ПРОЄКТІ тут був би виклик справжніх команд, наприклад:
#   npm test -- --ci
#   npm run lint
#   npm run typecheck

echo "=== (демо) Running test suite ==="
echo "→ у справжньому проєкті тут: npm test"
echo ""
echo "=== (демо) Running lint ==="
echo "→ у справжньому проєкті тут: npm run lint"
echo ""
echo "VERIFICATION: PASS (demo output — no real tests configured in this sample project)"
