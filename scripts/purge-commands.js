import dotenv from 'dotenv';
dotenv.config();
import { REST, Routes } from 'discord.js';

if (!process.env.BOT_TOKEN || !process.env.CLIENT_ID) {
  console.error('Missing BOT_TOKEN or CLIENT_ID in .env file!');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    const guildId = process.env.GUILD_ID;
    if (guildId && /^\d+$/.test(guildId)) {
      console.log(`Purging all guild application (/) commands for guild ${guildId}...`);
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
        { body: [] }
      );
      console.log(`Successfully purged guild commands for guild ${guildId}.`);
    } else {
      console.log('Purging all global application (/) commands...');
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: [] }
      );
      console.log('Successfully purged all global application commands.');
    }
  } catch (error) {
    console.error('Error purging commands:', error);
  }
})();
