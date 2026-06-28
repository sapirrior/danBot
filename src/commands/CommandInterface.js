export default class CommandInterface {
  constructor(args) {
    for (let key in args) {
      if (key === 'execute') {
        this.executeCommand = args[key];
      } else {
        this[key] = args[key];
      }
    }

    if (!this.builder) {
      throw new Error('Command registration error: builder (SlashCommandBuilder) is required.');
    }

    this.name = this.builder.name;
    this.description = this.builder.description;
    this.slashData = this.builder.toJSON();
  }

  async execute(params) {
    // 1. Check if the command is restricted to the bot owner
    if (this.ownerOnly && params.user.id !== params.config.owner) {
      params.error(', this command is restricted to the bot owner!', { ephemeral: true });
      return;
    }

    // 2. Check if the bot itself has correct client permissions in this channel
    if (params.guild && this.permissions) {
      const channel = params.channel;
      const botMember = params.guild.members.me || await params.guild.members.fetch(params.client.user.id);
      const channelPerms = channel.permissionsFor(botMember);
      
      for (let i = 0; i < this.permissions.length; i++) {
        const requiredPerm = this.permissions[i];
        if (!channelPerms || !channelPerms.has(requiredPerm)) {
          params.error(
            `, the bot is missing the \`${requiredPerm}\` permission! Please configure the permissions or contact your server admin.`,
            { ephemeral: true }
          );
          return;
        }
      }
    }

    // 3. Defer reply if configured (helps prevent Discord Gateway timeout warnings)
    if (this.defer) {
      await params.interaction.deferReply({ ephemeral: this.ephemeral ?? false });
    }

    // 4. Run the bound command
    await this.executeCommand.bind(params)(params);
  }
}
