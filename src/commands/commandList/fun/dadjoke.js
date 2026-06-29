import CommandInterface from '../../CommandInterface.js';

export default new CommandInterface({
  name:        'dadjoke',
  aliases:     ['joke', 'haha'],
  description: 'Fetches a random dad joke.',
  args:        '',
  example:     ['sudo dadjoke'],
  group:       'fun',
  cooldown:    4000,
  permissions: ['SendMessages', 'EmbedLinks'],

  execute: async function (p) {
    const url = 'https://icanhazdadjoke.com/';

    try {
      // 1. Fetch data from the API with required headers
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'danBot (Discord Bot)'
        }
      });

      // 2. Handle HTTP errors
      if (!response.ok) {
        return p.error(', the joke database is currently offline. Try again later.');
      }

      const data = await response.json();

      // 3. Handle potential API JSON errors
      if (!data || !data.joke) {
        return p.error(', failed to retrieve a joke from the database.');
      }

      // 4. Build and send the embed
      const embed = {
        color: p.config.embed?.color || 5793266,
        author: {
          name: p.user.username,
          icon_url: p.user.displayAvatarURL()
        },
        description: data.joke,
        footer: {
          text: "Read the hottest dad jokes."
        }
      };

      await p.send({ embeds: [embed] });

    } catch (err) {
      // 5. Catch network timeouts or JSON parsing errors
      p.logger.error(`Dadjoke command fetch error: ${err.stack || err}`);
      return p.error(', something went wrong while trying to connect to the joke database.');
    }
  }
});
