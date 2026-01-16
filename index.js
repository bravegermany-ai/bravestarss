import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

// START
bot.start((ctx) => {
  const name = ctx.from.first_name || "User";

  ctx.reply(
    `👋 Willkommen bei BRAVE, ${name}!\n\n⭐ Wähle dein Paket:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐ 250 Stars (≈ 5,39 €)", "S250")],
      [Markup.button.callback("⭐ 500 Stars (≈ 10,79 €)", "S500")],
      [Markup.button.callback("⭐ 1.000 Stars (≈ 21,99 €)", "S1000")],
      [Markup.button.callback("⭐ 2.500 Stars (≈ 53,99 €)", "S2500")],
      [Markup.button.callback("⭐ 5.000 Stars (≈ 109 €)", "S5000")],
      [Markup.button.callback("⭐ 10.000 Stars (≈ 219 €)", "S10000")]
    ])
  );
});

// PAYMENT HANDLER
const sendInvoice = (ctx, stars, label) => {
  return ctx.replyWithInvoice({
    title: "⭐ BRAVE Stars",
    description: label,
    payload: `stars_${stars}`,
    provider_token: "",
    currency: "XTR",
    prices: [{ label, amount: stars }]
  });
};

bot.action("S250", (ctx) => sendInvoice(ctx, 250, "250 Stars"));
bot.action("S500", (ctx) => sendInvoice(ctx, 500, "500 Stars"));
bot.action("S1000", (ctx) => sendInvoice(ctx, 1000, "1.000 Stars"));
bot.action("S2500", (ctx) => sendInvoice(ctx, 2500, "2.500 Stars"));
bot.action("S5000", (ctx) => sendInvoice(ctx, 5000, "5.000 Stars"));
bot.action("S10000", (ctx) => sendInvoice(ctx, 10000, "10.000 Stars"));

// CHECKOUT
bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

// SUCCESS
bot.on("successful_payment", (ctx) => {
  const stars = ctx.message.successful_payment.total_amount;
  ctx.reply(`✅ Zahlung erfolgreich!\n⭐ ${stars} Stars erhalten`);
});

bot.launch({ dropPendingUpdates: true });
console.log("BOT STARTET");
