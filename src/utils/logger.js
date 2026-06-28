import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const config = require('../data/config.json');

function timestamp() {
  return new Date().toISOString();
}

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4
};

function shouldLog(levelName) {
  const configLevel = config.logging?.level || 'info';
  return levels[levelName] >= levels[configLevel];
}

export function log(msg) {
  if (shouldLog('info')) {
    console.log(`[${timestamp()}] [INFO] ${msg}`);
  }
}

export function warn(msg) {
  if (shouldLog('warn')) {
    console.warn(`[${timestamp()}] [WARN] ${msg}`);
  }
}

export function error(msg) {
  if (shouldLog('error')) {
    console.error(`[${timestamp()}] [ERROR] ${msg}`);
  }
}

export function fatal(msg) {
  if (shouldLog('fatal')) {
    console.error(`[${timestamp()}] [FATAL] ${msg}`);
  }
  process.exit(1);
}

export function command(commandName, user, guild) {
  if (config.debug && shouldLog('info')) {
    const guildContext = guild ? `guild: ${guild.id}` : 'DM';
    log(`[CMD] ${commandName} | user: ${user.id} | tag: ${user.username} | ${guildContext}`);
  }
}

export function incr(metric) {
  // Metrics placeholder
}
