import CommandInterface from '../../CommandInterface.js';

export default new CommandInterface({
  name:        'meme',
  aliases:     ['m', 'dankmeme'],
  description: 'Fetches a random meme from Reddit. You can specify a subreddit topic.',
  args:        '[topic]',
  example:     ['sudo meme', 'sudo meme ProgrammerHumor'],
  group:       'memes',
  cooldown:    5000, 
  permissions: ['SendMessages', 'EmbedLinks'], // EmbedLinks is required to display the image

  execute: async function (p) {
    // 1. Extract the optional topic parameter
    const topic = p.args.length > 0 ? p.args[0] : '';
    
    // 2. Validate topic: alphanumeric and underscores only to prevent malformed requests
    if (topic && !/^[a-zA-Z0-9_]+$/.test(topic)) {
      return p.error(', that topic is invalid. Please use only letters, numbers, and underscores.');
    }

    const url = topic 
      ? `https://meme-api.com/gimme/${encodeURIComponent(topic)}` 
      : 'https://meme-api.com/gimme';

    try {
      // 3. Fetch data from the API
      const response = await fetch(url);
      
      // 4. Handle HTTP errors (e.g., subreddit not found or private)
      if (!response.ok) {
        if (response.status === 404 || response.status === 403) {
          return p.error(`, I couldn't find any memes for the topic \`${topic}\`. Try another one!`);
        }
        return p.error(', the meme API is currently unavailable. Try again later.');
      }

      const data = await response.json();

      // 5. Handle potential API JSON errors that return a 200 OK
      if (data.code || data.message) {
         return p.error(`, API error: ${data.message || 'Unknown error'}`);
      }

      // 6. Edge case: Prevent NSFW memes from appearing in SFW channels
      if (data.nsfw && !p.channel.nsfw) {
        return p.error(', I found a meme, but it is marked as NSFW. Use this command in an NSFW channel to see it!');
      }

      // 7. Build and send the embed
      const embed = {
        color: p.config.embed?.color || 5793266,
        title: data.title && data.title.length <= 256 ? data.title : 'Random Meme',
        url: data.postLink,
        image: {
          url: data.url
        },
        footer: {
          text: "See the goofiest memes on Reddit!"
        }
      };

      await p.send({ embeds: [embed] });
      
    } catch (err) {
      // 8. Catch network timeouts or JSON parsing errors
      p.logger.error(`Meme command fetch error: ${err.stack || err}`);
      return p.error(', something went wrong while trying to connect to the meme database.');
    }
  }
});

