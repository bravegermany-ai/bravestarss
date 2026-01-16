import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "⭐ Willkommen! Klicke auf den Button um mit Telegram Stars zu zahlen:",
    Markup.inlineKeyboard([
      Markup.button.callback("⭐ 10 Stars kaufen", "BUY_10")
    ])
  );
});

bot.action("BUY_10", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.replyWithInvoice({
    title: "⭐ 10 Telegram Stars",
    description: "Premium freischalten",
    payload: "stars_10",
    provider_token: "", // bei Stars IMMER leer
    currency: "XTR",
    prices: [{ label: "10 Stars", amount: 10 }]
  });
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

bot.on("successful_payment", (ctx) => {
  ctx.reply("✅ Zahlung erfolgreich! Danke ⭐");
});

bot.launch({ dropPendingUpdates: true });
