import CommandInterface from '../../CommandInterface.js';

export default new CommandInterface({
  name:        'guildicon',
  aliases:     ['servericon', 'icon'],
  description: 'Displays the current server\'s icon.',
  args:        '',
  example:     ['sudo guildicon'],
  group:       'utility',
  cooldown:    10000,
  permissions: ['SendMessages', 'EmbedLinks'],

  execute: async function (p) {
    const iconUrl = p.guild.iconURL({ size: 1024, extension: 'png' });

    if (!iconUrl) {
      return p.error(', this server does not have an icon!');
    }

    const embed = {
      color: p.config.embed?.color || 5864793,
      author: {
        name: p.guild.name,
        icon_url: p.guild.iconURL() || undefined
      },
      image: {
        url: iconUrl
      },
      footer: {
        text: 'Server icon details.'
      }
    };

    await p.send({ embeds: [embed] });
  }
});
