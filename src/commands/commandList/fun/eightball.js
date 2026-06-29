import CommandInterface from '../../CommandInterface.js';

const pronouns = [
  'kiddo',
  'nerd',
  'friend',
  'mate',
  'chief',
  'comrade',
  'pal',
  'boss',
  'partner',
  'buddy'
];

const answers = [
  'yes',
  'no',
  'absolutely',
  'no way',
  'never',
  'of course',
  'maybe',
  'not a chance',
  'probably',
  'you bet',
  'only if you shut up',
  'sadly yes',
  'sadly no',
  'positive',
  'negative'
];

const faces = [
  '._.',
  'c:',
  'xD',
  '.-.',
  ':/',
  '¯\\_(ツ)_/¯',
  '( ͡° ͜ʖ ͡°)',
  ':P',
  ';)'
];

const templates = [
  '?a?, ?p?.',
  '?a? ?f?',
  '?a?!',
  'look, ?a? ?p?...',
  'obviously ?a? ?f?',
  '?a? ?p? ?f?'
];

function getAnswer() {
  const template = templates[Math.floor(Math.random() * templates.length)];
  const answer = answers[Math.floor(Math.random() * answers.length)];
  const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
  const face = faces[Math.floor(Math.random() * faces.length)];

  return template
    .replace('?a?', answer)
    .replace('?p?', pronoun)
    .replace('?f?', face);
}

export default new CommandInterface({
  name:        'eightball',
  aliases:     ['8b', '8ball', 'ask'],
  description: 'Ask the magic 8-ball a question',
  args:        '{question}',
  example:     ['sudo 8ball Will I win?'],
  group:       'fun',
  cooldown:    3000,
  permissions: ['SendMessages'],

  execute: async function (p) {
    if (p.args.length === 0) {
      return p.error(', you need to ask a question!');
    }

    const question = p.rawArgs;
    const reply = getAnswer();

    await p.send(
      `🎱 **| Asked:** ${question}\n` +
      `**Answer:** ${reply}`
    );
  }
});
