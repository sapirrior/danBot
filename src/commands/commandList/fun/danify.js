import CommandInterface from '../../CommandInterface.js';

function danify(text) {
  let lower = text.toLowerCase();

  // Vast list of Discord slang replacements
  const replacements = [
    [/\bhello\b|\bhey\b|\bhi\b/g, 'yo'],
    [/\byes\b|\byeah\b/g, 'fr'],
    [/\bno\b|\bnot\b/g, 'nah'],
    [/\bok\b|\bokay\b/g, 'bet'],
    [/\bgood\b|\bgreat\b|\bawesome\b/g, 'goated'],
    [/\bwhat\b/g, 'wut'],
    [/\bwhy\b/g, 'y'],
    [/\byou\b/g, 'u'],
    [/\bare\b/g, 'r'],
    [/\bpeople\b/g, 'npcs'],
    [/\bplease\b/g, 'pls'],
    [/\bseriously\b|\breally\b/g, 'no cap'],
    [/\bcan't\b|\bcannot\b/g, 'skill issue'],
    [/\bsorry\b/g, 'my bad lol'],
    [/\bfriend\b|\bbro\b/g, () => Math.random() > 0.5 ? 'sir' : 'bruh'],
    [/\bguys\b|\bboys\b|\bdudes\b/g, () => Math.random() > 0.5 ? 'sirs' : 'boys'],
    [/\bwant to\b/g, 'wanna'],
    [/\bgoing to\b/g, 'gonna'],
    [/\bhave to\b/g, 'gotta'],
    [/\bdon't know\b/g, 'dunno'],
    [/\bthem\b/g, 'em'],
    [/\beasy\b/g, 'free'],
    [/\bloser\b|\bnoob\b/g, 'l'],
    [/\bwin\b/g, 'w'],
    [/\blose\b/g, 'l'],
    [/\bthanks\b|\bthank you\b/g, 'ty'],
    [/\boh my god\b|\bomg\b/g, 'omg'],
    [/\bbecause\b/g, 'cuz'],
    [/\babout\b/g, 'abt'],
    [/\bbefore\b/g, 'b4'],
    [/\btalk\b/g, 'yap'],
    [/\btalking\b/g, 'yapping'],
    [/\blove\b/g, 'rizz'],
    [/\blook at\b/g, 'peep'],
    [/\bunderstand\b/g, 'get'],
    [/\bworried\b|\bafraid\b/g, 'shook'],
    [/\bcomputer\b|\bpc\b/g, 'setup'],
    [/\bgame\b/g, 'lobby'],
    [/\bhard\b|\bdifficult\b/g, 'tryhard']
  ];

  for (const [regex, replacement] of replacements) {
    lower = lower.replace(regex, replacement);
  }

  // Balanced goofy Dan tag endings
  const endings = [
    ' fr sir',
    ' no cap sir',
    ' nah id win sir',
    ' shut up sir',
    ' skill issue sir',
    ' lol sir',
    ' sir',
    ' fr',
    ' no cap',
    ' nah id win',
    ' shut up',
    ' skill issue',
    ' lol',
    ' bruh'
  ];

  const randomEnding = endings[Math.floor(Math.random() * endings.length)];
  return lower.trim() + randomEnding;
}

export default new CommandInterface({
  name:        'danify',
  aliases:     ['dan'],
  description: 'Convert text into realistic goofy Dan-speak',
  args:        '[text]',
  example:     ['sudo danify hello world', 'sudo danify'],
  group:       'fun',
  cooldown:    6000, // Increased cooldown for algorithmic safety
  permissions: ['SendMessages'],

  execute: async function (p) {
    let text;
    let author;

    if (p.args.length === 0) {
      try {
        const messages = await p.channel.messages.fetch({ limit: 1, before: p.message.id });
        const prevMsg = messages.first();
        if (!prevMsg || !prevMsg.content) {
          return p.error(', there is no message before yours to danify!');
        }
        text = prevMsg.content;
        author = prevMsg.author;
      } catch (err) {
        return p.error(', failed to fetch the previous message.');
      }
    } else {
      text = p.rawArgs;
    }

    const danifiedText = danify(text);
    const result = author ? `**${author.username}:** ${danifiedText}` : danifiedText;
    await p.send(result);
  }
});
