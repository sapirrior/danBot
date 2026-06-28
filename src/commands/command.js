import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import CommandInterface from './CommandInterface.js';
import * as ban from '../utils/ban.js';
import * as cooldown from '../utils/cooldown.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandListPath = path.join(__dirname, 'commandList');

const commands = new Map();
const commandGroups = new Map();

class Command {
  constructor(main) {
    this.main = main;
    this.commands = commands;
    this.commandGroups = commandGroups;
  }

  async init() {
    await initCommands(commandListPath);
  }

  async executeInteraction(interaction) {
    const commandName = interaction.commandName.toLowerCase();
    const command = commands.get(commandName);

    // Check if the command exists
    if (!command) {
      this.main.logger.warn(`Interaction called unknown command: ${commandName}`);
      return;
    }

    // Initialize params
    const param = initParam(interaction, commandName, this.main);

    // Run execution sequence
    await executeCommand(this.main, param);
  }
}

async function executeCommand(main, p) {
  // 1. Spam Guard check
  if (!(await ban.check(p, p.command))) {
    return;
  }

  // 2. Cooldown check
  if (!(await cooldown.check(p, p.command))) {
    return;
  }

  // 3. Command execution
  try {
    const cmdInstance = commands.get(p.command);
    await cmdInstance.execute(p);
    
    // 4. Logging Command Execution
    main.logger.command(p.command, p.user, p.guild);
  } catch (err) {
    main.logger.error(`Error executing command ${p.command}: ${err.stack || err}`);
    try {
      await p.error(', an unexpected error occurred while executing this command.');
    } catch (sendErr) {
      main.logger.error(`Failed to send execution error reply: ${sendErr}`);
    }
  }
}

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

async function initCommands(dirPath) {
  const registerCommand = function (command) {
    const name = command.name.toLowerCase();
    commands.set(name, command);

    // Populate commandGroups Map
    const groupName = command.group || 'utility';
    if (!commandGroups.has(groupName)) {
      commandGroups.set(groupName, []);
    }
    commandGroups.get(groupName).push(name);
  };

  try {
    const files = await getFilesRecursively(dirPath);
    for (let i = 0; i < files.length; i++) {
      const filePath = files[i];
      if (filePath.endsWith('.js')) {
        const fileUrl = pathToFileURL(filePath).href;
        const imported = await import(fileUrl);
        const commandObj = imported.default || imported;
        if (commandObj instanceof CommandInterface) {
          registerCommand(commandObj);
        }
      }
    }
  } catch (err) {
    console.error('Failed to recursively load commands:', err);
  }
}

function initParam(interaction, command, main) {
  const args = {};
  if (interaction.options?.data) {
    interaction.options.data.forEach((opt) => {
      args[opt.name] = opt.value;
      if (opt.options) {
        opt.options.forEach((subOpt) => {
          args[subOpt.name] = subOpt.value;
        });
      }
    });
  }

  const param = {
    interaction,
    user: interaction.user,
    member: interaction.member,
    guild: interaction.guild,
    channel: interaction.channel,
    client: main.client,
    command,
    args,

    config: main.config,
    logger: main.logger,
    global: main.global,
    commands,
    commandGroups,

    // Pre-bound sender helper methods (no OwO reply prefixing)
    send: main.sender.send(interaction),
    error: main.sender.error(interaction)
  };

  param.setCooldown = function (ms) {
    main.cooldown.setCooldown(command, param.user.id, ms);
  };

  param.getName = (user) => {
    return param.global.getName(user || param.member || param.user);
  };

  param.getTag = (user) => {
    return param.global.getTag(user || param.user);
  };

  return param;
}

export default Command;
