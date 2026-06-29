export async function handle(message) {
  // ── Fast exits — ordered from cheapest to most specific ───────────────────

  // 1. Ignore all bots (covers self, webhooks, other bots)
  if (message.author.bot) return;

  // 2. Ignore DMs — prefix commands are guild-only
  //    (remove this line if you ever want DM command support)
  if (!message.guild) return;

  // 3. Prefix check — case-insensitive
  const prefix = this.prefix.toLowerCase();
  const lowerContent = message.content.toLowerCase();
  if (!lowerContent.startsWith(prefix)) return;

  // Enforce whitespace separation if prefix doesn't end with a space and there is more content
  if (!this.prefix.endsWith(' ') && message.content.length > prefix.length) {
    const nextChar = message.content.charAt(prefix.length);
    if (!/\s/.test(nextChar)) return;
  }

  // ── Parse ──────────────────────────────────────────────────────────────────

  // Slice the prefix, collapse leading whitespace, split on any whitespace run
  const raw = message.content.slice(prefix.length).trimStart();
  if (raw.length === 0) return; // bare prefix with no command

  const parts       = raw.split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args        = parts.slice(1); // string[]

  // ── Resolve ────────────────────────────────────────────────────────────────

  // resolve() checks the name map then the alias map — both O(1)
  const command = this.command.resolve(commandName);

  // Unknown command: silent ignore.
  // At 8M daily users, sending "command not found" for every typo wastes
  // rate-limit budget and increases perceived bot noise. OwoBot, Dank Memer
  // (prefix era), and every large-scale bot follow this convention.
  if (!command) return;

  // ── Execute ────────────────────────────────────────────────────────────────

  await this.command.executeMessage(message, command, args);
}
