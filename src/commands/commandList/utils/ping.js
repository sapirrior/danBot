// src/commands/commandList/utils/ping.js
import CommandInterface from '../../CommandInterface.js';

export default new CommandInterface({
  name:        'ping',
  aliases:     ['p', 'latency'],
  description: 'Shows the current shard latency',
  args:        '',
  example:     ['sudo ping'],
  group:       'utility',
  cooldown:    5000,
  permissions: ['SendMessages'],

  execute: async function (p) {
    const ms = p.client.ws.ping;
    await p.send(`🏓 **|** Pong! Latency: **${ms}ms**`);
  }
});
