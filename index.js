import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on("text", (ctx) => {
  ctx.reply("👋 Ich habe deine Nachricht bekommen!");
});

bot.launch({ dropPendingUpdates: true });
