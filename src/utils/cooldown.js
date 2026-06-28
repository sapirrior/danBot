const locks = new Set();
const cooldowns = new Map();

export async function check(p, command) {
  const userId = p.user.id;
  const key = `${command}:${userId}`;

  // Skip cooldown if user is owner
  if (p.config.owner === userId) {
    return true;
  }

  // Prevent multiple warnings within the same cooldown cycle
  if (cooldowns.get(key + ':blocked')) {
    return false;
  }

  // Semaphore lock to block concurrent duplicate packets
  if (locks.has(key)) {
    return false;
  }
  locks.add(key);

  try {
    const ccd = cooldowns.get(key) || { command, lasttime: new Date('2018-01-01') };
    const now = Date.now();
    const diff = now - ccd.lasttime.getTime();

    // Query cooldown duration directly from command instance
    const cmdInstance = p.commands.get(command);
    const cdDuration = cmdInstance?.cooldown !== undefined ? cmdInstance.cooldown : p.config.cooldown.defaultMs;

    if (diff < cdDuration) {
      const remaining = cdDuration - diff;
      const timerText = p.global.toDiscordTimestamp(now + remaining);

      p.error(`, slow down and try this command again ${timerText}`, { ephemeral: true });

      // Apply temporary warning block
      cooldowns.set(key + ':blocked', true);
      setTimeout(() => {
        cooldowns.delete(key + ':blocked');
      }, remaining);

      return false;
    } else {
      ccd.lasttime = new Date();
      cooldowns.set(key, ccd);
      
      // Auto-cleanup memory entries
      setTimeout(() => {
        cooldowns.delete(key);
      }, cdDuration);

      return true;
    }
  } catch (e) {
    p.logger.error(`Error in cooldown.js: ${e}`);
    return false;
  } finally {
    locks.delete(key);
  }
}

export async function setCooldown(command, userId, cooldownMs = 0) {
  const key = `${command}:${userId}`;
  const now = Date.now();
  cooldowns.set(key, { command, lasttime: new Date(now + cooldownMs) });
}
