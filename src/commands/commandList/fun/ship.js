import CommandInterface from '../../CommandInterface.js';

const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];

function combinename(name1, name2) {
  let count1 = -1;
  let count2 = -1;
  const mid1 = Math.ceil(name1.length / 2) - 1;
  const mid2 = Math.ceil(name2.length / 2) - 1;
  let noVowel1 = false;
  let noVowel2 = false;

  for (let i = mid1; i >= 0; i--) {
    count1++;
    if (vowels.includes(name1.charAt(i).toLowerCase())) {
      i = -1;
    } else if (i === 0) {
      noVowel1 = true;
    }
  }
  for (let i = mid2; i < name2.length; i++) {
    count2++;
    if (vowels.includes(name2.charAt(i).toLowerCase())) {
      i = name2.length;
    } else if (i === name2.length - 1) {
      noVowel2 = true;
    }
  }

  let name = '';
  if (noVowel1 && noVowel2) {
    name = name1.substring(0, mid1 + 1) + name2.substring(mid2);
  } else if (count1 <= count2) {
    name = name1.substring(0, mid1 - count1 + 1) + name2.substring(mid2);
  } else {
    name = name1.substring(0, mid1 + 1) + name2.substring(mid2 + count2);
  }
  return name;
}

async function resolveMember(p, arg) {
  if (!arg) return null;
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
  name:        'ship',
  aliases:     ['combine', 'love'],
  description: 'Ship two server members together and combine their names',
  args:        '{@user1} {@user2}',
  example:     ['sudo ship @user1 @user2', 'sudo ship @user1'],
  group:       'fun',
  cooldown:    5000,
  permissions: ['SendMessages'],

  execute: async function (p) {
    let member1;
    let member2;

    if (p.args.length === 2) {
      member1 = await resolveMember(p, p.args[0]);
      member2 = await resolveMember(p, p.args[1]);
    } else if (p.args.length === 1) {
      member1 = p.member;
      member2 = await resolveMember(p, p.args[0]);
    } else {
      return p.error(', invalid arguments! Provide one or two users.');
    }

    if (!member1 || !member2) {
      return p.error(', could not find one or both of those users!');
    }

    const name1 = member1.nickname || member1.user.username;
    const name2 = member2.nickname || member2.user.username;
    const combined = combinename(name1, name2);

    await p.send(`💞 **${name1}** + **${name2}** = **${combined}**`);
  }
});
