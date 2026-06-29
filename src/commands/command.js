import fs   from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import CommandInterface from './CommandInterface.js';
import * as ban      from '../utils/ban.js';
import * as cooldown from '../utils/cooldown.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const commandListPath = path.join(__dirname, 'commandList');

// Module-level Maps — populated once at startup, never mutated at runtime
const commands      = new Map(); // name   → CommandInterface
const aliases       = new Map(); // alias  → canonical name (string)
const commandGroups = new Map(); // group  → string[]

class Command {
  constructor(main) {
    this.main          = main;
    this.commands      = commands;
    this.aliases       = aliases;
    this.commandGroups = commandGroups;
  }

  async init() {
    await loadCommands(commandListPath);
  }

  // Resolve a raw input (name OR alias) to a CommandInterface instance.
  // Called on every message — must be O(1).
  resolve(input) {
    const direct = commands.get(input);
    if (direct) return direct;
    const canonical = aliases.get(input);
    return canonical ? commands.get(canonical) : null;
  }

  // Entry point from messageCreate.js
  async executeMessage(message, command, args) {
    const p = buildParam(message, command, args, this.main);

    if (!(await ban.check(p, command.name)))      return;
    if (!(await cooldown.check(p, command.name))) return;

    try {
      await command.execute(p);
      this.main.logger.command(command.name, p.user, p.guild);
    } catch (err) {
      this.main.logger.error(`Error in command "${command.name}": ${err.stack || err}`);
      try { await p.error(', an unexpected error occurred while running this command.'); }
      catch (_) { /* channel perms may have changed mid-execution */ }
    }
  }
}

// ── Startup loader ─────────────────────────────────────────────────────────────

async function loadCommands(dirPath) {
  let files;
  try {
    files = await readFilesRecursively(dirPath);
  } catch (err) {
    console.error('Failed to read command directory:', err);
    return;
  }

  for (const filePath of files) {
    if (!filePath.endsWith('.js')) continue;

    let commandObj;
    try {
      const mod = await import(pathToFileURL(filePath).href);
      commandObj = mod.default ?? mod;
    } catch (err) {
      console.error(`Failed to import command file ${filePath}:`, err);
      continue;
    }

    if (!(commandObj instanceof CommandInterface)) continue;

    const name = commandObj.name;
    commands.set(name, commandObj);

    // Register aliases — all point back to the canonical name
    if (commandObj.aliases) {
      for (const alias of commandObj.aliases) {
        if (commands.has(alias)) {
          console.warn(`Alias "${alias}" for "${name}" conflicts with an existing command name. Skipping.`);
          continue;
        }
        aliases.set(alias, name);
      }
    }

    // Group tracking
    const group = commandObj.group || 'utility';
    if (!commandGroups.has(group)) commandGroups.set(group, []);
    commandGroups.get(group).push(name);
  }
}

async function readFilesRecursively(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = await Promise.all(
    entries.map(entry => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? readFilesRecursively(res) : res;
    })
  );
  return results.flat();
}

// ── Param builder ──────────────────────────────────────────────────────────────

function buildParam(message, command, args, main) {
  const p = {
    // Raw Discord objects
    message,
    user:    message.author,
    member:  message.member,
    guild:   message.guild,
    channel: message.channel,
    client:  main.client,

    // Command context
    command:  command.name,
    args,            // string[]  — positional tokens after command name
    rawArgs:  args.join(' '), // full remaining string, for commands that need it

    // Shared state
    config:        main.config,
    logger:        main.logger,
    global:        main.global,
    commands,
    commandGroups,

    // Sender helpers
    send:  main.sender.send(message),
    error: main.sender.error(message),
  };

  // Convenience helpers
  p.setCooldown = (ms) => main.cooldown.setCooldown(command.name, p.user.id, ms);
  p.getName     = (u)  => main.global.getName(u ?? p.member ?? p.user);
  p.getTag      = (u)  => main.global.getTag(u ?? p.user);

  return p;
}

export default Command;
