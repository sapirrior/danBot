import { ActivityType } from 'discord.js';
import { exec } from 'child_process';
import os from 'os';
import util from 'util';

const execPromise = util.promisify(exec);

export function handle() {
  this.logger.log(`Logged in as ${this.client.user.tag}!`);
  this.logger.log(`Serving ${this.client.guilds.cache.size} guilds.`);
  
  // Set status activity to Streaming "nah i'd win!"
  this.client.user.setActivity("nah i'd win!", {
    type: ActivityType.Streaming,
    url: 'https://twitch.tv/twitch'
  });
  
  this.logger.log('ready');

  // Stats logging loop
  const channelId = this.config.statusChannel;
  if (channelId && /^\d+$/.test(channelId)) {
    const sendStats = async () => {
      try {
        const channel = await this.client.channels.fetch(channelId);
        if (channel && typeof channel.send === 'function') {
          const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
          const usedRam = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);

          const load = os.loadavg()[0];
          const cores = os.cpus().length || 1;
          const cpuUsedPct = Math.min(100, Math.max(0, (load / cores) * 100)).toFixed(1);

          let usedDisk = 'Unknown';
          let totalDisk = 'Unknown';
          try {
            const { stdout } = await execPromise('df -h . | tail -1');
            const parts = stdout.trim().split(/\s+/);
            if (parts.length >= 3) {
              totalDisk = parts[1];
              usedDisk = parts[2];
            }
          } catch (e) {}

          const embed = {
            color: this.config.embed?.color || 5793266,
            description: [
              `RAM: ${usedRam} GB / ${totalRam} GB`,
              `CPU: ${cpuUsedPct}%`,
              `Disk: ${usedDisk} / ${totalDisk}`
            ].join('\n')
          };

          await channel.send({ embeds: [embed] });
        }
      } catch (err) {
        this.logger.error(`Failed to send status update: ${err.stack || err}`);
      }
    };

    // Run immediately on startup
    sendStats();
    // Run every 15 minutes
    setInterval(sendStats, 15 * 60 * 1000);
  }
}
