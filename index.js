import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

(async () => {
  const me = await bot.telegram.getMe();
  console.log("ICH BIN BOT:", me.username, me.id);
})();

bot.on("message", (ctx) => {
  console.log("UPDATE ANGEKOMMEN");
  ctx.reply("✅ Nachricht angekommen");
});

bot.launch({ dropPendingUpdates: true });
