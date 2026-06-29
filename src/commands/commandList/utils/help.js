import CommandInterface from '../../CommandInterface.js';

const groupMeta = {
  rankings: { name: 'Rankings', emoji: '🎖' },
  // economy: { name: 'Economy', emoji: '💰' },
  // animals: { name: 'Animals', emoji: '🌱' },
  // gambling: { name: 'Gambling', emoji: '🎲' },
  fun: { name: 'Fun', emoji: '🎱' },
  social: { name: 'Social', emoji: '🎭' },
  memes: { name: 'Meme Generation', emoji: '😂' },
  emotes: { name: 'Emotes', emoji: '🙂' },
  actions: { name: 'Actions', emoji: '🤗' },
  utility: { name: 'Utility', emoji: '🔧' }
};

export default new CommandInterface({
  name:        'help',
  aliases:     ['h', 'commands'],
  description: 'Shows a list of available commands',
  args:        '[command]',
  example:     ['sudo help', 'sudo help ping'],
  group:       'utility',
  cooldown:    3000,
  permissions: ['SendMessages'],

  execute: async function (p) {
    const prefix = p.config.prefix;
    const displayPrefix = prefix.endsWith(' ') ? prefix : `${prefix} `;

    // If a specific command is queried
    if (p.args.length > 0) {
      const query = p.args[0].toLowerCase();
      const command = p.commands.get(query) || Array.from(p.commands.values()).find(c => c.aliases.includes(query));
      if (!command) {
        return p.error(`, command \`${query}\` not found.`);
      }

      const cdMs = command.cooldown !== undefined ? command.cooldown : (p.config.cooldown?.defaultMs || 5000);
      const cooldownText = `\n# Cooldown\n${cdMs}ms`;

      let aliasText = '';
      if (command.aliases && command.aliases.length > 0) {
        aliasText = `\n# Aliases\n${command.aliases.join(' , ')}`;
      }

      let exampleText = '';
      if (command.example && command.example.length > 0) {
        exampleText = `\n# Example Command(s)\n${command.example.join(' , ')}`.trimEnd();
      }

      const text =
        '```md\n' +
        `< ${displayPrefix}${command.name} ${command.args || ''} >\n` +
        `# Description\n${command.description || 'No description'}` +
        cooldownText +
        aliasText +
        exampleText +
        '\n``````md\n' +
        '> Remove brackets when typing commands\n' +
        '> [] = optional arguments\n' +
        '> {} = optional user input```';

      return p.send(text);
    }

    // Default categorized help list matching OwO structure using fields
    const fields = [];
    for (const [groupName, cmdNames] of p.commandGroups.entries()) {
      const meta = groupMeta[groupName] || { name: groupName.charAt(0).toUpperCase() + groupName.slice(1), emoji: '📁' };
      fields.push({
        name: `${meta.emoji} ${meta.name}`,
        value: cmdNames.map(name => `\`${name}\``).join('  ')
      });
    }

    const embed = {
      author: {
        name: 'Command List',
        icon_url: p.user.displayAvatarURL()
      },
      color: p.config.embed?.color || 5793266,
      description: `Here is the list of commands!\nFor more info on a specific command, use \`${displayPrefix}help {command}\``,
      fields: fields
    };

    await p.send({ embeds: [embed] });
  }
});
