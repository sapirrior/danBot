# Dan (danBot)

A growing, multi-purpose Discord entertainment bot in the same category as Dank Memer and OwO Bot — designed to pack maximum capabilities into a zero-bloat, highly efficient architecture.

## Features

- **Prefix-Only Command Architecture:** Uses the `sudo` prefix (case-insensitive, space-enforced).
- **High-Performance Memory Sweepers:** Custom cache sweeping and cache capping built-in to prevent RAM creep.
- **Goofy Discord Personality:** Implements custom word replacements, random tag endings, and balanced `"sir"` responses.
- **Dynamic Help Desk:** Detailed command listing and markdown formatting styled after classic command setups.
- **Zero External Dependencies:** Built entirely on Node.js builtins and `discord.js`.

---

## Commands

All commands are invoked using the `sudo` prefix (e.g. `sudo ping`):
*   `help` - Shows a list of available commands or specific command details.
*   `ping` - Shows the current bot latency.
*   `8ball` - Ask a question to the magic 8ball.
*   `danify` - Translates text into goofy Dan-speak.
*   `ship` - Blends two users' names into a ship name.
*   `dadjoke` - Fetches a random dad joke.
*   `meme` - Fetches a random meme from Reddit.
*   `avatar` - Displays a user's avatar and profile details.
*   `translate` - Translates text to another language.
*   `prefix` - Shows the active prefix.
*   `guildicon` - Displays the server's icon.
*   `choose` - Decides a random option from a list.
*   `roll` - Rolls custom dice (e.g. 2d6, 1d20).
*   `scramble` - Shuffles the letters of a word or phrase.

---

## Configuration

Settings are managed in `src/data/config.json`:
- `prefix`: The default bot command prefix (defaults to `"sudo"`).
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

This project is licensed under the **GNU Affero General Public License v3 (AGPL-3.0)**. See the `LICENSE` file for details. 

*Copyright (c) 2026 Nolan Stark*
