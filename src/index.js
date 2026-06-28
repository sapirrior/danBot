/*
 * danBot - Slash-Commands-Only Discord Bot
 * Inspired by OwO Bot's architecture
 */
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.BOT_TOKEN) {
  console.error('No BOT_TOKEN found in .env file!');
  process.exit(1);
}

import Bot from './bot.js';
const bot = new Bot();

// Process-level crash guards
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err.stack || err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason?.stack || reason);
});

// Launch Bot
await bot.launch();
console.log('Bot process initiated...');
