import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

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
        const eventName = file.slice(0, -3); // E.g., 'ready', 'interactionCreate'
        const filePath = path.resolve(__dirname, file);
        const fileUrl = pathToFileURL(filePath).href;
        
        const imported = await import(fileUrl);
        const handler = imported.default || imported;
        
        if (typeof handler.handle === 'function') {
          this.main.client.on(eventName, handler.handle.bind(this.main));
        }
      }
    }
  }
}

export default EventHandler;
