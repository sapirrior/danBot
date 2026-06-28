export async function handle(interaction) {
  if (interaction.isChatInputCommand()) {
    this.command.executeInteraction(interaction);
  }
}
