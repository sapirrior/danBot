import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Events } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EventHandler {
  constructor(main) {
    this.main = main;
  }

  async init() {
    const files = await fs.readdir(__dirname);
    const selfName = path.basename(__filename);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.endsWith('.js') && file !== selfName) {
        const eventName = file.slice(0, -3); // E.g., 'clientReady', 'interactionCreate'
        const filePath = path.resolve(__dirname, file);
        const fileUrl = pathToFileURL(filePath).href;
        
        const imported = await import(fileUrl);
        const handler = imported.default || imported;
        
        if (typeof handler.handle === 'function') {
          const eventKey = eventName.charAt(0).toUpperCase() + eventName.slice(1);
          const discordEvent = Events[eventKey];
          if (discordEvent) {
            this.main.client.on(discordEvent, handler.handle.bind(this.main));
          } else {
            // Fallback to raw eventName if not found in Events enum
            this.main.client.on(eventName, handler.handle.bind(this.main));
          }
        }
      }
    }
  }
}

export default EventHandler;
