import CommandInterface from '../../CommandInterface.js';

export default new CommandInterface({
  name:        'prefix',
  aliases:     ['pref'],
  description: 'Shows the current command prefix.',
  args:        '',
  example:     ['sudo prefix'],
  group:       'utility',
  cooldown:    3000,
  permissions: ['SendMessages'],

  execute: async function (p) {
    await p.send(`The current prefix is \`${p.config.prefix}\`, sir.`);
  }
});
