import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf(process.env.8320888074:AAEmaJK8bhyVUaS_MOVTfCvshMImAYE18uM);

bot.start((ctx) => {
  ctx.reply(
    "⭐ Willkommen! Klicke zum Bezahlen:",
    Markup.inlineKeyboard([
      Markup.button.pay("⭐ 10 Stars zahlen")
    ])
  );
});

bot.on("callback_query", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithInvoice({
    title: "Premium Feature",
    description: "Zugriff freischalten",
    payload: "premium_10",
    provider_token: "",
    currency: "XTR",
    prices: [{ label: "Premium", amount: 10 }]
  });
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));
bot.on("successful_payment", (ctx) => ctx.reply("✅ Zahlung erfolgreich!"));

bot.launch();
