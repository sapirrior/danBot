import { ActivityType } from 'discord.js';

export function handle() {
  this.logger.log(`Logged in as ${this.client.user.tag}!`);
  this.logger.log(`Serving ${this.client.guilds.cache.size} guilds.`);
  
  // Set status activity to Streaming "nah i'd win!"
  this.client.user.setActivity("nah i'd win!", {
    type: ActivityType.Streaming,
    url: 'https://twitch.tv/twitch'
  });
  
  this.logger.log('ready');
}
