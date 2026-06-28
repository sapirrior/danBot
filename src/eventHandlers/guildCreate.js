export function handle(guild) {
  this.logger.log(`Joined guild: ${guild.name} (ID: ${guild.id}) | Members: ${guild.memberCount}`);
  if (!this.debug) {
    this.logger.incr('guildcount');
  }
}
