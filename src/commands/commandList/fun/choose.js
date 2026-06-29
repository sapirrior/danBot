import CommandInterface from '../../CommandInterface.js';

const msgs = [
  'I choose ?!',
  'I like ?!',
  'I love ?!',
  '? is the best choice',
  'definitely ?!',
  '? 100%'
];

export default new CommandInterface({
  name:        'choose',
  aliases:     ['pick', 'decide'],
  description: 'Decides a random option from a list of items separated by or, comma, or pipe.',
  args:        '{item1} or {item2} or ...',
  example:     ['sudo choose dog or cat', 'sudo choose valorant, minecraft, csgo'],
  group:       'fun',
  cooldown:    5000,
  permissions: ['SendMessages', 'EmbedLinks'],

  execute: async function (p) {
    if (p.args.length === 0) {
      return p.error(', invalid arguments! Please include a list of items!');
    }

    // Split by common delimiters: pipe, semicolon, comma, or the word 'or'
    let rawInput = p.args.join(' ');
    let items = rawInput
      .replace(/\s+or\s+/gi, '|')
      .replace(/[,;]/g, '|')
      .split('|')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (items.length <= 1) {
      return p.error(', you silly! I can\'t just choose from one item!');
    }

    const item = items[Math.floor(Math.random() * items.length)];
    const chosenTemplate = msgs[Math.floor(Math.random() * msgs.length)];
    let responseText = chosenTemplate.replace('?', `**${item}**`);

    // Add balanced 'sir' personality suffix
    if (Math.random() > 0.5) {
      responseText += ', sir!';
    } else {
      responseText += '!';
    }

    const embed = {
      color: p.config.embed?.color || 5864793,
      author: {
        name: p.user.username,
        icon_url: p.user.displayAvatarURL()
      },
      description: responseText,
      footer: {
        text: 'Decided from your options.'
      }
    };

    await p.send({ embeds: [embed] });
  }
});
