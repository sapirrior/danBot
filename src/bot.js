import { Client, GatewayIntentBits } from 'discord.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const config = require('./data/config.json');

import * as logger from './utils/logger.js';
import * as global from './utils/global.js';
import * as sender from './utils/sender.js';
import * as cooldown from './utils/cooldown.js';
import * as ban from './utils/ban.js';
import Command from './commands/command.js';
import EventHandler from './eventHandlers/EventHandler.js';

class Bot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
      ]
    });

    // Configuration
    this.config = config;
    this.debug = this.config.debug;
    this.prefix = this.config.prefix;

    // Load Utilities (Mirrors owo.js order)
    this.logger = logger;
    
    this.global = global;
    this.global.init(this);

    this.sender = sender;
    this.sender.init(this);

    this.cooldown = cooldown;
    this.ban = ban;

    // Load commands
    this.command = new Command(this);
  }

  async launch() {
    // Initialize async modules in ESM
    await this.command.init();

    // Bind bot events
    this.eventHandler = new EventHandler(this);
    await this.eventHandler.init();

    await this.client.login(process.env.BOT_TOKEN);
    this.logger.log('launch');
  }
}

export default Bot;
