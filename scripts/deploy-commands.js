import dotenv from 'dotenv';
dotenv.config();
import { REST, Routes } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import CommandInterface from '../src/commands/CommandInterface.js';

if (!process.env.BOT_TOKEN || !process.env.CLIENT_ID) {
  console.error('Missing BOT_TOKEN or CLIENT_ID in .env file!');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandListPath = path.join(__dirname, '..', 'src', 'commands', 'commandList');

const commandsData = [];

async function getFilesRecursively(dir) {
  const subdirs = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    subdirs.map((subdir) => {
      const res = path.resolve(dir, subdir.name);
      return subdir.isDirectory() ? getFilesRecursively(res) : res;
    })
  );
  return files.flat();
}

async function traverse(dirPath) {
  try {
    const files = await getFilesRecursively(dirPath);
    for (let i = 0; i < files.length; i++) {
      const filePath = files[i];
      if (filePath.endsWith('.js')) {
        const fileUrl = pathToFileURL(filePath).href;
        const imported = await import(fileUrl);
        const commandObj = imported.default || imported;
        if (commandObj instanceof CommandInterface && commandObj.slashData) {
          commandsData.push(commandObj.slashData);
        }
      }
    }
  } catch (err) {
    console.error('Failed to load commands for deployment:', err);
  }
}

await traverse(commandListPath);

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commandsData.length} application (/) commands...`);

    let data;
    const guildId = process.env.GUILD_ID;
    if (guildId && /^\d+$/.test(guildId)) {
      data = await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
        { body: commandsData }
      );
      console.log(`Successfully reloaded commands for development guild ${guildId}.`);
    } else {
      data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commandsData }
      );
      console.log('Successfully reloaded application commands globally.');
    }
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
})();
