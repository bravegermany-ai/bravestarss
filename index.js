import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("👋 Bot funktioniert!");
});

bot.on("text", (ctx) => {
  ctx.reply("Nachricht angekommen ✅");
});

bot.launch();
console.log("Bot läuft...");
