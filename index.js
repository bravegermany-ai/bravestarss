import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.8320888074:AAEmaJK8bhyVUaS_MOVTfCvshMImAYE18uM);

bot.on("text", (ctx) => {
  ctx.reply("👋 Ich habe deine Nachricht bekommen!");
});

bot.launch({ dropPendingUpdates: true });
