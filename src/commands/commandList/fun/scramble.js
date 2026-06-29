import CommandInterface from '../../CommandInterface.js';

export default new CommandInterface({
  name:        'scramble',
  aliases:     ['anagram', 'shuffle'],
  description: 'Scrambles the letters of a word or phrase.',
  args:        '<text>',
  example:     ['sudo scramble hello', 'sudo scramble discord bot'],
  group:       'fun',
  cooldown:    5000,
  permissions: ['SendMessages', 'EmbedLinks'],

  execute: async function (p) {
    if (p.args.length === 0) {
      return p.error(', please provide some text to scramble!');
    }

    const text = p.args.join(' ');
    if (text.length > 500) {
      return p.error(', the text is too long (maximum 500 characters)!');
    }

    // Split text into characters and shuffle them using Fisher-Yates algorithm
    const chars = text.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    const scrambled = chars.join('');

    let textOut = scrambled;
    if (Math.random() > 0.5) {
      textOut = textOut + ', sir!';
    }

    const embed = {
      color: p.config.embed?.color || 5864793,
      author: {
        name: p.user.username,
        icon_url: p.user.displayAvatarURL()
      },
      description: textOut,
      footer: {
        text: `Original: "${text.length > 50 ? text.slice(0, 50) + '...' : text}"`
      }
    };

    await p.send({ embeds: [embed] });
  }
});
