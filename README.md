# JustTrust Bot

A simple Telegram bot built with Grammy.js.

## Prerequisites

- Node.js 20
- Docker and Docker Compose
- Telegram Bot Token (get it from [@BotFather](https://t.me/botfather))

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Create environment file:
```bash
cp .env.example .env
```
Then edit `.env` and add your Telegram bot token.

3. Start the development environment:
```bash
docker compose up -d
```

## Development

Run the bot in development mode:
```bash
yarn dev
```

## Production

Run the bot in production mode:
```bash
yarn start:prod
```

## Commands

- `/start` - Start the bot
- `/action` - Perform an action

## License

MIT
