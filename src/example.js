// Простий приклад файлу вихідного коду — щоб .claude/ мав що "обслуговувати".
// Наприклад, PostToolUse hook (format-after-edit.sh) спрацював би саме
// на редагування таких файлів (.js/.ts/.jsx/.tsx).

function greet(name) {
  return `Hello, ${name}!`;
}

module.exports = { greet };
