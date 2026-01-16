import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use((ctx) => {
  ctx.reply("✅ Ich empfange Nachrichten");
});

bot.launch({ dropPendingUpdates: true });
