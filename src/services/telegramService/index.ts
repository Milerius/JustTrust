import { Bot, Context, session } from 'grammy';
import { run } from '@grammyjs/runner';
import { hydrate } from '@grammyjs/hydrate';
import { autoRetry } from '@grammyjs/auto-retry';
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { Buttons, CallbackButton, Handler, MyContext, UrlButton } from './types.js';
import { logError } from '../../helpers/utils.js';

class TelegramService {
  public bot: Bot<MyContext>;

  constructor(botToken: string) {
    this.bot = new Bot<MyContext>(botToken);
    this.bot.use(
      session({
        initial: () => {
          return {};
        },
      }),
    );
    this.bot.api.config.use(autoRetry());
    this.bot.api.config.use(apiThrottler())
    this.bot.use(hydrate());
  }

  async startBot() {
    this.registerHandlers(...handlers);
    this.handleErrors();
    this.setupBotMetadata();
    run(this.bot);
  }

  private async setupBotMetadata() {
    await this.bot.api.setMyCommands([
      {
        command: 'start',
        description: 'Start the bot',
      },
      {
        command: 'action',
        description: 'Perform an action',
      },
    ]);

    await this.bot.api.setMyDescription('JustTrust Bot - A simple Telegram bot');
  }

  private handleErrors() {
    this.bot.catch((err) => {
      const ctx = err.ctx;
      logError('handleErrors', err);
      this.sendMessageWithButtons({ ctx, message: 'An error occurred. Please try again.' }, [
        [
          { text: 'Home', command: 'start' },
        ],
      ]);
    });
  }

  private registerHandlers(...handlers: Handler[]) {
    handlers.forEach(({ command, middleware }) => {
      this.bot.command(command, middleware);
    });

    this.bot.on('callback_query:data', async (ctx) => {
      const queryData = ctx.callbackQuery.data;
      const matchingCommand = handlers.find((handler) => handler.command === queryData);
      if (matchingCommand) {
        await matchingCommand.middleware(ctx);
      }
    });
  }

  async sendMessageWithButtons(
    params: { ctx: Context; message: string },
    buttons?: Buttons,
  ): Promise<number> {
    const inline_keyboard = buttons?.map((row) =>
      row.map((button) => {
        if ('command' in button) {
          return {
            text: button.text,
            callback_data: button.command,
          };
        } else {
          return button;
        }
      }),
    );

    const sentMessage = await params.ctx.reply(params.message, {
      parse_mode: 'HTML',
      reply_markup: inline_keyboard ? { inline_keyboard } : undefined,
    });

    return sentMessage.message_id;
  }

  getCallbackButton(command: string, text: string): CallbackButton {
    return { text, command };
  }

  getUrlButton(label: string, url: string): UrlButton {
    return { text: label, url };
  }
}

const handlers: Handler[] = [
  {
    command: 'start',
    middleware: async (ctx) => {
      await telegramService.sendMessageWithButtons(
        { ctx, message: 'Welcome to JustTrust Bot!' },
        [[{ text: 'Perform Action', command: 'action' }]],
      );
    },
  },
  {
    command: 'action',
    middleware: async (ctx) => {
      await telegramService.sendMessageWithButtons(
        { ctx, message: 'Action button clicked!' },
        [[{ text: 'Back to Home', command: 'start' }]],
      );
    },
  },
];

const telegramService = new TelegramService(process.env.TELEGRAM_BOT_TOKEN);

export default telegramService; 