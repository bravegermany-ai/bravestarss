import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("✅ Bot lebt!");
});

bot.launch({ dropPendingUpdates: true });
