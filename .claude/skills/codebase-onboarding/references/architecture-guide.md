<!--
  ЩО ЦЕ: Level 2 progressive disclosure — Claude читає цей файл ЛИШЕ
  якщо хтось питає про архітектуру. Питання "де додати компонент"
  НІКОЛИ не завантажить цей файл — воно вирішується на Level 1.
-->

# Architecture Guide

## Directory Structure
- `src/` — application source code (in a real project: handlers, models,
  routes, etc.)
- `.claude/` — Claude Code configuration: agents, skills, hooks, settings

## Pattern
This demo follows a simple structure. In a real project, describe here:
- MVC / REST API / microservices — whichever applies
- Where request handling starts and ends
- How layers talk to each other (e.g. controller → service → repository)

## Data Flow
Describe request → response flow here, e.g.:
1. Request hits a route handler
2. Handler calls a service function
3. Service talks to the database / external API
4. Response is shaped and returned
