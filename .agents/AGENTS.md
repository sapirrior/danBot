# AGENTS.md — danBot

> This file is intended to be read by AI coding agents (e.g., Antigravity, Claude Code, Cursor, Codex, etc.) 
> when working in this codebase. It defines the project's standards, personality, architecture decisions,
> and working procedures. If you find yourself giving the same instruction twice, it belongs here.

---

## Project Overview

**Dan** is a growing, multi-purpose Discord entertainment bot built with Node.js and `discord.js` v14,
in the same category as bots like **Dank Memer** and **OwO Bot** — fun, interactive, and community-driven.

Dan is **not lightweight by features or ambition** — it is lightweight by **codebase efficiency and architecture**.
The goal is to pack the power of a full-featured entertainment bot into a zero-bloat, highly optimized codebase
that runs comfortably on minimal hardware without sacrificing capabilities. Think of it as punching above its weight class.

The codebase is maintained by **Nolan Stark** and is licensed under **GNU AGPL-3.0**.

Dan runs **exclusively on prefix commands** (default prefix: `sudo`). There are **no slash commands**.
The bot prioritizes a **zero-dependency, zero-bloat** architecture. Before reaching for an external package,
always ask whether it can be done with Node.js builtins or native `fetch`.

---

## Dan's Personality

Dan is not a boring bot. When writing Dan's responses, error messages, welcome messages, or any
user-facing text, follow these personality traits:

- **Goofy but not cringy.** Dan is relaxed, funny, and uses Discord-native slang such as `"fr"`,
  `"nah id win"`, `"skill issue"`, `"no cap"`, `"bruh"`.
- **Balanced use of "sir".** Dan occasionally addresses users as `"sir"` (e.g., `"skill issue, sir"`,
  `"definitely dog, sir!"`). This should appear in **roughly 50% of relevant responses**, not every single one.
  Overusing it kills the personality. It should feel natural and situational.
- **Honest and casual.** Dan speaks like a young, confident Discord user. Avoid formal or corporate language.
- **Not aggressively rude.** Dan is goofy, not toxic. Keep error messages light, playful, and non-hostile.
- **Never uses "OwO", "UwU", or any uwu-speak.** These are explicitly banned from Dan's vocabulary.

---

## Architecture Decisions (Do NOT Change Without Explicit Approval)

- **Prefix-only.** The bot uses `sudo` as the default prefix. Do not introduce slash commands, hybrid command systems,
  or any `SlashCommandBuilder` imports unless the owner explicitly requests it.
- **No external databases.** The bot intentionally has no database layer. Do not introduce `sqlite3`, `mongoose`,
  `sequelize`, `prisma`, or any other ORM or database driver.
- **No heavy image processing libraries.** Do not introduce `canvas`, `sharp`, `jimp`, or any native-binding
  image library. Dan does not generate images from code.
- **ES Modules only.** All files use `import`/`export` syntax (ESM). Do not use `require()`, `module.exports`, or
  CommonJS patterns under any circumstances.
- **No TypeScript.** The project uses plain JavaScript. Do not introduce TypeScript, `.ts` files, or `tsconfig.json`.
- **Avoid package bloat.** Every new `npm` dependency must have a strong justification. Prefer native Node.js
  builtins (`fetch`, `os`, `v8`, `child_process`) and `discord.js` internals over new packages.
- **AGPL-3.0 compliance.** Any code written for or incorporated into this project must be compatible with
  the GNU Affero General Public License v3.

---

## Code Style and Conventions

- **2-space indentation.** All JavaScript files use 2-space indentation — no tabs.
- **Single quotes.** Use single quotes `'` for all strings unless template literals are required.
- **Semicolons.** Do not use semicolons at the end of lines. The project follows a no-semicolon style.
- **Async/await.** Prefer `async/await` over raw `.then()/.catch()` Promise chains for readability.
- **Named exports.** Event handlers export a named `handle` function. Commands use `export default`.
- **No console.log.** Always use `p.logger.error()`, `p.logger.log()`, or `this.logger.*` for logging.
  Raw `console.log` or `console.error` should never appear in non-debug code.
- **Comments.** Write numbered inline comments inside execute functions that describe each logical step
  (e.g., `// 1. Validate args`, `// 2. Fetch from API`, etc.) for readability. This is the established
  style across all Dan commands.

---

## Command Structure Guidelines

When creating a new command, always follow this checklist:

1. Use `CommandInterface` with all required fields: `name`, `aliases`, `description`, `args`, `example`,
   `group`, `cooldown`, `permissions`.
2. The `group` field must match one of the active groups defined in the help command's group metadata
   (e.g., `fun`, `utils`, `social`, `memes`). Do not invent new groups without updating the help command.
3. The `args` field should use `{...}` for required inputs and `[...]` for optional inputs.
4. The `example` field must contain real, functional usage examples including the prefix.
5. Always validate user input before processing. Never trust raw `p.args` without sanity checks.
6. All API calls must be wrapped in a `try/catch` block.
7. Use `p.error()` from the sender utility for all error responses. Never use `p.send()` directly for errors.
8. Syntax-check all new files with `node --check <file>` before considering the task done.
9. Cooldowns should be appropriate to the command's resource usage. Network calls warrant at least
   `5000ms–10000ms`. Simple text commands can use `2000ms–5000ms`.

---

## Embed Styling Guidelines

All embeds in Dan follow a consistent style. When building an embed object:

- **Color:** Always use `p.config.embed?.color` or fall back to the hardcoded project palette decimal.
- **Author Row:** Use `{ name: p.user.username, icon_url: p.user.displayAvatarURL() }` to set the
  author icon to the executing user's avatar, not a generic bot icon.
- **No bold titles.** Prefer clean `description` text over large `title` fields for most commands.
- **Footer:** Keep footers short, lowercase, and informative (e.g., `"Read the hottest dad jokes."`).
- **No excessive markdown.** Avoid cramming multiple bold sections, bullet points, or heading-level
  markdown into embeds. Keep them clean and readable.

---

## Working Style and Procedures

When working in this codebase, an agent must follow these procedures:

1. **Read before writing.** Always inspect the existing related files before implementing something new.
   Understand how `CommandInterface`, `sender.js`, and the `p` payload object work before modifying them.
2. **Minimal footprint.** Only modify files that are directly required to implement the requested feature.
   Do not refactor adjacent code unless explicitly asked.
3. **Syntax check after every edit.** Run `node --check` on any modified JavaScript file to verify
   there are no parse errors before finishing.
4. **Preserve all existing comments and docstrings** in files you edit unless they are directly
   related to the code being changed.
5. **Commit with meaningful messages.** Follow the `type: brief summary\n\n- bullet details` format.
   Use prefixes like `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `chore:`. Never include "owo"
   or "uwu" anywhere in commit messages.
6. **No speculative changes.** Do not add features, refactors, or "improvements" that were not
   explicitly requested. When unsure, ask rather than assume.
7. **Do not break existing commands.** Before adding a new feature, verify it does not conflict with
   existing command names or aliases by checking the command registry.
8. **Owner bypass is intentional.** The bot bypasses cooldowns and certain restrictions for the user
   whose ID matches `config.owner`. Do not remove or modify this bypass without explicit instruction.

---

## Environment and Setup

- **Runtime:** Node.js (v18 or higher recommended for native `fetch` support).
- **Module system:** ESM (`"type": "module"` in `package.json`).
- **Entry point:** `npm start` runs the bot.
- **Credentials:** Loaded from a `.env` file using `dotenv`. Required variables are `BOT_TOKEN` and `GUILD_ID`.
  Do not commit secrets. Do not hardcode tokens, IDs, or credentials in source files.
- **Gateway intents:** The bot requires the **Message Content** privileged intent to be enabled in the
  Discord Developer Portal.

---

## What Dan Is Not

To prevent scope creep, the following are explicitly out of scope for this project:

- **No economy system.** No coins, wallets, shops, inventories, or daily reward loops.
- **No database.** No user data persistence across sessions.
- **No NSFW commands.** Not appropriate for Dan's purpose or target audience.
- **No slash commands.** Prefix-only is a deliberate, non-negotiable architectural decision.
- **No heavy computation commands.** Avoid commands that run heavy algorithms synchronously on the main thread.
  If a task blocks for more than ~100ms, it should not be added without proper async handling.
