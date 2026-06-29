import CommandInterface from '../../CommandInterface.js';

export default new CommandInterface({
  name:        'translate',
  aliases:     ['tl'],
  description: 'Translates a message to a specific language (defaults to English).',
  args:        '{message} [-language_code]',
  example:     ['sudo translate Hello -es', 'sudo translate no hablo espanol'],
  group:       'social',
  cooldown:    10000,
  permissions: ['SendMessages', 'EmbedLinks'],

  execute: async function (p) {
    if (p.args.length === 0) {
      return p.error(', please include a message to translate!');
    }

    // 1. Get language code from the last parameter (e.g. -es)
    let lang = p.args[p.args.length - 1];
    let textSegments = [...p.args];
    if (lang.startsWith('-') && lang.length > 1) {
      lang = lang.slice(1).toLowerCase();
      textSegments.pop();
    } else {
      lang = 'en';
    }

    const text = textSegments.join(' ');
    if (text.length > 700) {
      return p.error(', the message is too long (maximum 700 characters)!');
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;

    try {
      // 2. Fetch translation
      const response = await fetch(url);
      if (!response.ok) {
        return p.error(', the translation API is currently unavailable. Try again later.');
      }

      const data = await response.json();
      if (!data || !data[0]) {
        return p.error(', failed to translate the message.');
      }

      const translatedText = data[0].map(segment => segment[0]).join('');

      // 3. Send translation embed
      const embed = {
        color: p.config.embed?.color || 5864793,
        author: {
          name: p.user.username,
          icon_url: p.user.displayAvatarURL()
        },
        description: translatedText,
        footer: {
          text: `Translated from: "${text.length > 50 ? text.slice(0, 50) + '...' : text}"`
        }
      };

      await p.send({ embeds: [embed] });

    } catch (err) {
      p.logger.error(`Translate command fetch error: ${err.stack || err}`);
      return p.error(', something went wrong while trying to connect to the translation engine.');
    }
  }
});
