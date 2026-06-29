import CommandInterface from '../../CommandInterface.js';

async function resolveMember(p, arg) {
  if (!arg) return p.member;
  const match = arg.match(/\d+/);
  if (match) {
    const id = match[0];
    try {
      return await p.guild.members.fetch(id);
    } catch (e) {
      // ignore
    }
  }
  const query = arg.toLowerCase();
  return p.guild.members.cache.find(m => 
    m.user.username.toLowerCase().includes(query) || 
    (m.nickname && m.nickname.toLowerCase().includes(query))
  );
}

export default new CommandInterface({
  name:        'avatar',
  aliases:     ['av', 'user'],
  description: 'Displays a user\'s avatar and profile details.',
  args:        '[@user]',
  example:     ['sudo avatar', 'sudo avatar @user'],
  group:       'social',
  cooldown:    5000,
  permissions: ['SendMessages', 'EmbedLinks'],

  execute: async function (p) {
    const member = await resolveMember(p, p.args[0]);

    if (!member) {
      return p.error(', could not find that user!');
    }

    const user = member.user;
    const roleColor = member.displayColor;
    const embedColor = roleColor !== 0 ? roleColor : (p.config.embed?.color || 5864793);

    const embed = {
      color: embedColor,
      author: {
        name: user.username,
        icon_url: user.displayAvatarURL()
      },
      description: [
        `Nickname: ${member.nickname || 'None'}`,
        `ID: ${user.id}`
      ].join('\n'),
      image: {
        url: user.displayAvatarURL({ size: 1024, extension: 'png' })
      },
      footer: {
        text: 'Profile details.'
      }
    };

    await p.send({ embeds: [embed] });
  }
});
