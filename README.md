# Dan (danBot)

A lightweight, prefix-only Discord bot built with Node.js and `discord.js` v14, optimized for low-resource hosting at scale.

## Features

- **Prefix-Only Command Architecture:** Uses the `sudo` prefix (case-insensitive, space-enforced).
- **High-Performance Memory Sweepers:** Custom cache sweeping and cache capping built-in to prevent RAM creep.
- **Goofy Discord Personality:** Implements custom word replacements, random tag endings, and balanced `"sir"` responses.
- **Dynamic Help Desk:** Detailed command listing and markdown formatting styled after classic command setups.
- **Zero External Dependencies:** Built entirely on Node.js builtins and `discord.js`.

---

## Commands

All commands are invoked using the `sudo` prefix (e.g. `sudo ping`):
*   `help`
*   `ping`
*   `8ball`
*   `danify`
*   `ship`

---

## Configuration

Settings are managed in `src/data/config.json`:
- `prefix`: The default bot command prefix (defaults to `"sudo"`).
- `statusChannel`: Discord Channel ID where system status embeds (RAM, CPU, and Disk metrics) are sent periodically on startup and every 15 minutes.
- `embed`: Hex color configuration for normal, success, and error embeds.
- `rateLimit`: Maximum commands allowed per window to prevent spam.

---

## Setup & Running

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Configure credentials:**
    Create a `.env` file in the root directory based on `.env.example`:
    ```env
    BOT_TOKEN=your_bot_token_here
    GUILD_ID=your_development_guild_id_here
    ```
3.  **Ensure Gateway Intents:**
    Ensure **Message Content Intent** is enabled in your Discord Developer Portal under the **Bot** tab.
4.  **Start the bot:**
    ```bash
    npm start
    ```

---

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details. 

*Copyright (c) 2026 Nolan Stark*
