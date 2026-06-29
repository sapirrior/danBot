import { Client, GatewayIntentBits, Options } from 'discord.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const config = require('./data/config.json');

import * as logger   from './utils/logger.js';
import * as global_  from './utils/global.js';
import * as sender   from './utils/sender.js';
import * as cooldown from './utils/cooldown.js';
import * as ban      from './utils/ban.js';
import Command       from './commands/command.js';
import EventHandler  from './eventHandlers/EventHandler.js';

class Bot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Privileged — must be approved in Dev Portal
      ],

      // ── Memory caps: critical for 28K guilds on cheap hosting ─────────────
      // discord.js defaults cache 200 messages per channel and ALL members.
      // At this scale that silently climbs into hundreds of MB over days.
      makeCache: Options.cacheWithLimits({
        MessageManager:             25,  // default 200 — we never read history
        GuildMemberManager:          5,  // only need bot's own member object
        UserManager:               100,  // small rolling window is fine
        PresenceManager:             0,  // never needed
        GuildEmojiManager:           0,
        GuildStickerManager:         0,
        GuildInviteManager:          0,
        GuildScheduledEventManager:  0,
        ThreadManager:               0,
        ReactionManager:             0,
      }),

      // ── Cache sweepers: reclaim RAM on long uptime ─────────────────────────
      sweepers: {
        messages: { interval: 1800, lifetime: 900 }, // sweep every 30m, evict >15m old
        users:    { interval: 3600, filter: () => u => !u.bot },
      },
    });

    this.config = config;
    this.debug  = config.debug;
    this.prefix = config.prefix;

    this.logger   = logger;
    this.global   = global_;
    this.global.init(this);
    this.sender   = sender;
    this.sender.init(this);
    this.cooldown = cooldown;
    this.ban      = ban;

    this.command = new Command(this);
  }

  async launch() {
    await this.command.init();
    this.eventHandler = new EventHandler(this);
    await this.eventHandler.init();
    await this.client.login(process.env.BOT_TOKEN);
    this.logger.log('launch');
  }
}

export default Bot;
