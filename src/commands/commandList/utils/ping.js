import { SlashCommandBuilder } from 'discord.js';
import CommandInterface from '../../CommandInterface.js';

export default new CommandInterface({
  builder: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows the shard latency in ms'),

  permissions: ['SendMessages'],
  group: 'utility',
  cooldown: 5000,

  execute: async function (p) {
    const apiPing = p.client.ws.ping;
    await p.send(`🏓 **|** Pong! Shard Latency: ${apiPing}ms.`);
  }
});
