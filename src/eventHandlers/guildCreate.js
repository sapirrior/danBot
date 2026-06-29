import { ChannelType, PermissionFlagsBits } from 'discord.js';

export async function handle(guild) {
  this.logger.log(`Joined guild: ${guild.name} (ID: ${guild.id}) | Members: ${guild.memberCount}`);
  if (!this.debug) {
    this.logger.incr('guildcount');
  }

  // Find system channel or first writeable text channel
  let botMember = guild.members.me;
  if (!botMember) {
    try {
      botMember = await guild.members.fetch(this.client.user.id);
    } catch (e) {
      // ignore
    }
  }

  if (!botMember) return;

  const hasPerms = (chan) => 
    chan && 
    chan.type === ChannelType.GuildText &&
    chan.permissionsFor(botMember)?.has([
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks
    ]);

  let channel = guild.systemChannel;
  if (!hasPerms(channel)) {
    channel = guild.channels.cache.find(hasPerms);
  }

  if (channel) {
    try {
      const embed = {
        color: this.config.embed?.color || 5793266,
        description: [
          'Hello there sir... This is **Dan**.',
          '-# Yes, the one and only, shut up.',
          '',
          'I am here to run some commands for you, or just call you an NPC. Run `sudo help` to see a list of commands, sir!',
          'Let me know if you need anything, otherwise let\'s get started.'
        ].join('\n')
      };
      await channel.send({ embeds: [embed] });
    } catch (err) {
      this.logger.error(`Failed to send intro embed in guild ${guild.id}: ${err.stack || err}`);
    }
  }
}
