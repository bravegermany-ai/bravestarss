import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on("message", (ctx) => {
  ctx.reply("✅ Bot funktioniert und empfängt Nachrichten");
});

bot.launch({ dropPendingUpdates: true });

console.log("Bot gestartet");
