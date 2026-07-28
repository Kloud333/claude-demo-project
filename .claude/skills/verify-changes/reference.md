<!--
  ЩО ЦЕ: side-файл skill з детальним матеріалом. Claude читає ЛИШЕ коли
  реально потрібна ця глибина деталей — на відміну від skill.md, який
  завжди в контексті (щойно skill викликаний).
-->

# Verification Checklist (Full Reference)

## 1. Test suite
- Run `./check.sh` — this wraps the project's actual test command.
- A passing test suite is necessary but NOT sufficient — see below.

## 2. Diff review
- Read `git diff` yourself, file by file.
- Files that were part of the plan first, then anything *outside* the plan
  — an unexpected touched file is a red flag even if tests pass.

## 3. Weakened-test detection
Common ways tests get quietly weakened (watch for these in the diff):
- An assertion changed from `expect(x).toBe(5)` to `expect(x).toBeDefined()`
- A test skipped with `.skip()` or commented out
- A try/catch added around an assertion that swallows failures
- Increased timeout/retry counts that mask flakiness instead of fixing it

## 4. Reporting format
```
VERIFICATION: PASS | FAIL
Tests run: <command + result summary>
Diff reviewed: yes/no
Unexpected files touched: <list or "none">
Weakened tests found: <list or "none">
```
