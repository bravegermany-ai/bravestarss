import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

// /start
bot.start((ctx) => {
  const name = ctx.from.first_name || "User";

  ctx.reply(
    `👋 Willkommen bei BRAVE, ${name}!\n\n⭐ Wähle dein Paket:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("🟤 Bronze – 250 Stars (≈ 5,39 €)", "BRONZE")],
      [Markup.button.callback("⚪ Silber – 500 Stars (≈ 10,79 €)", "SILBER")],
      [Markup.button.callback("🟡 Gold – 1.000 Stars (≈ 21,99 €)", "GOLD")],
      [Markup.button.callback("🔵 Platin – 2.500 Stars (≈ 53,99 €)", "PLATIN")],
      [Markup.button.callback("🟣 Diamond – 5.000 Stars (≈ 109 €)", "DIAMOND")],
      [Markup.button.callback("🔴 Elite – 10.000 Stars (≈ 219 €)", "ELITE")]
    ])
  );
});

// Hilfsfunktion für Zahlung
const sendInvoice = (ctx, stars, name) => {
  ctx.answerCbQuery();
  return ctx.replyWithInvoice({
    title: `⭐ ${name} Paket`,
    description: `${name} Paket bei BRAVE`,
    payload: name.toLowerCase(),
    provider_token: "",
    currency: "XTR",
    prices: [{ label: `${name} – ${stars} Stars`, amount: stars }]
  });
};

// Aktionen
bot.action("BRONZE", (ctx) => sendInvoice(ctx, 250, "Bronze"));
bot.action("SILBER", (ctx) => sendInvoice(ctx, 500, "Silber"));
bot.action("GOLD", (ctx) => sendInvoice(ctx, 1000, "Gold"));
bot.action("PLATIN", (ctx) => sendInvoice(ctx, 2500, "Platin"));
bot.action("DIAMOND", (ctx) => sendInvoice(ctx, 5000, "Diamond"));
bot.action("ELITE", (ctx) => sendInvoice(ctx, 10000, "Elite"));

// Checkout bestätigen
bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

// Erfolg
bot.on("successful_payment", (ctx) => {
  const stars = ctx.message.successful_payment.total_amount;
  ctx.reply(`✅ Zahlung erfolgreich!\n⭐ Paket erhalten: ${stars} Stars`);
});

bot.launch({ dropPendingUpdates: true });
console.log("BOT STARTET");
