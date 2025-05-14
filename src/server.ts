import telegramService from './services/telegramService/index.js';
import { logError } from './helpers/utils.js';

async function main() {
  try {
    await telegramService.startBot();
    console.log('Bot is running...');
  } catch (error) {
    console.error(error);
    logError('main', error);
    process.exit(1);
  }
}

main(); 