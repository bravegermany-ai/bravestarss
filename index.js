import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

// /start
bot.start(async (ctx) => {
  const name = ctx.from.first_name || "User";

  await ctx.reply(
    `👋 Willkommen bei BRAVE, ${name}!\n\n⭐ Pakete (Zahlung über Telegram Stars):`,
    Markup.inlineKeyboard([
      [Markup.button.pay("⭐ VIP – 250 Stars (≈ 5,39 €)")],
      [Markup.button.pay("⭐ Ultra – 500 Stars (≈ 10,79 €)")],
      [Markup.button.pay("⭐ Pro – 1.000 Stars (≈ 21,99 €)")],
      [Markup.button.pay("⭐ Elite – 2.500 Stars (≈ 53,99 €)")],
      [Markup.button.pay("⭐ Supreme – 5.000 Stars (≈ 109 €)")],
      [Markup.button.pay("⭐ Ultimate – 10.000 Stars (≈ 219 €)")]
    ])
  );
});

// Checkout bestätigen
bot.on("pre_checkout_query", (ctx) => {
  ctx.answerPreCheckoutQuery(true);
});

// Zahlung erfolgreich
bot.on("successful_payment", async (ctx) => {
  const stars = ctx.message.successful_payment.total_amount;

  await ctx.reply(
    `✅ Zahlung erfolgreich!\n\n⭐ Du hast ${stars} Stars bezahlt.\n🔥 Danke für deinen Support!`
  );
});

bot.launch({ dropPendingUpdates: true });
