export default class CommandInterface {
  constructor(args) {
    // ── Required ─────────────────────────────────────────────────────────────
    if (!args.name || typeof args.name !== 'string') {
      throw new Error('CommandInterface: "name" (string) is required.');
    }
    if (typeof args.execute !== 'function') {
      throw new Error(`CommandInterface "${args.name}": "execute" (function) is required.`);
    }

    // ── Identity ──────────────────────────────────────────────────────────────
    this.name        = args.name.toLowerCase();
    this.aliases     = Array.isArray(args.aliases)
      ? args.aliases.map(a => a.toLowerCase())
      : [];
    this.description = args.description || '';
    this.args        = args.args        || '';   // e.g. '<user> [amount]'
    this.example     = Array.isArray(args.example)
      ? args.example
      : (args.example ? [args.example] : []);
    this.group       = args.group       || 'utility';

    // ── Behaviour ─────────────────────────────────────────────────────────────
    this.cooldown    = typeof args.cooldown === 'number' ? args.cooldown : 3000;
    this.ownerOnly   = args.ownerOnly  ?? false;
    this.guildOnly   = args.guildOnly  ?? true;
    this.permissions = Array.isArray(args.permissions) ? args.permissions : [];

    // ── Execution ─────────────────────────────────────────────────────────────
    this.executeCommand = args.execute;
  }

  async execute(p) {
    // 1. Owner-only guard
    if (this.ownerOnly && p.user.id !== p.config.owner) {
      return p.error(', this command is restricted to the bot owner!');
    }

    // 2. Guild-only guard
    if (this.guildOnly && !p.guild) {
      return p.error(', this command can only be used inside a server!');
    }

    // 3. Bot channel-permission guard
    if (p.guild && this.permissions.length > 0) {
      const botMember   = p.guild.members.me;
      const channelPerms = p.channel.permissionsFor(botMember);
      for (const perm of this.permissions) {
        if (!channelPerms?.has(perm)) {
          return p.error(
            `, the bot is missing the \`${perm}\` permission in this channel!`
          );
        }
      }
    }

    // 4. Run command
    await this.executeCommand.call(p, p);
  }
}
