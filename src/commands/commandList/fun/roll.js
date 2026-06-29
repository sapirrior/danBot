import CommandInterface from '../../CommandInterface.js';

const reactions = [
  'What a lucky day!',
  'What a bad day...',
  'Nice!',
  'Oof',
  'Oh no...',
  'Yikes',
  'Hurray!',
  'Amazing!',
  'Yes!',
  'Oh!',
  'Oh my.',
  'Lucky!',
  'Aw..',
  'Booo..'
];

export default new CommandInterface({
  name:        'roll',
  aliases:     ['dice', 'd20'],
  description: 'Rolls custom dice (e.g. 2d6, 1d20) or a single die.',
  args:        '[# of faces | NdS]',
  example:     ['sudo roll', 'sudo roll 20', 'sudo roll 2d6'],
  group:       'fun',
  cooldown:    5000,
  permissions: ['SendMessages', 'EmbedLinks'],

  execute: async function (p) {
    let count = 1;
    let sides = 6;
    let targetArg = p.args[0] || '';

    // Handle command alias 'd20' override
    if (p.command === 'd20') {
      sides = 20;
    }

    if (targetArg) {
      const diceMatch = targetArg.match(/^(\d+)d(\d+)$/i);
      if (diceMatch) {
        count = Math.min(100, parseInt(diceMatch[1], 10)) || 1;
        sides = Math.min(1000, parseInt(diceMatch[2], 10)) || 6;
      } else if (/^\d+$/.test(targetArg)) {
        sides = Math.min(1000, parseInt(targetArg, 10)) || 6;
      } else {
        return p.error(', that is an invalid dice format! Use a number or standard format like `2d6`.');
      }
    }

    const rolls = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const rolled = Math.ceil(sides * Math.random());
      rolls.push(rolled);
      sum += rolled;
    }

    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    let responseText = `${reaction} It's a **${sum}**!`;
    if (count > 1) {
      responseText = `${reaction} You rolled: [${rolls.join(', ')}] (Total: **${sum}**).`;
    }

    // Add balanced 'sir' personality suffix
    if (Math.random() > 0.5) {
      responseText = responseText.replace(/\.|\!$/, '') + ', sir!';
    }

    const embed = {
      color: p.config.embed?.color || 5864793,
      author: {
        name: p.user.username,
        icon_url: p.user.displayAvatarURL()
      },
      description: responseText,
      footer: {
        text: `Rolled ${count}x ${sides}-sided die.`
      }
    };

    await p.send({ embeds: [embed] });
  }
});
