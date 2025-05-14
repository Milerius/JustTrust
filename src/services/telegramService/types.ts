import { Context, SessionFlavor } from 'grammy';
import { HydrateFlavor } from '@grammyjs/hydrate';

interface SessionData {
  // Add session data as needed
}

export type MyContext = HydrateFlavor<Context & SessionFlavor<SessionData>>;

export interface Handler {
  command: string;
  middleware: (ctx: MyContext) => Promise<void>;
}

export type Buttons = Array<Array<CallbackButton | UrlButton>>;

export interface CallbackButton {
  text: string;
  command: string;
}

export interface UrlButton {
  text: string;
  url: string;
} 