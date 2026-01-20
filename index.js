import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   START
========================= */
bot.start((ctx) => {
  const username = ctx.from.first_name || "User";
  ctx.reply(
    `👋 Willkommen bei BRAVE, ${username}!\n\nWähle deinen Plan:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "PAY_1500")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "PAY_2500")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "PAY_5000")],
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "PAY_7500")],
      [Markup.button.callback("💳 Weitere Zahlungsmöglichkeiten", "OTHER_PAYMENTS")]
    ])
  );
});

/* =========================
   STAR PAYMENT ACTIONS
========================= */
const STAR_PRICES = {
  PAY_1500: 1500,
  PAY_2500: 2500,
  PAY_5000: 5000,
  PAY_7500: 7500,
};

bot.action(/PAY_\d+/, async (ctx) => {
  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");
  const stars = STAR_PRICES[ctx.match[0]];

  return ctx.replyWithInvoice({
    title: `VIP – ${stars} Stars`,
    description: `VIP-Zugang mit ${stars} Telegram-Sternen`,
    payload: `VIP_${stars}_${ctx.from.id}`,
    provider_token: "", // BOTFATHER PAYMENT TOKEN
    currency: "XTR", // Prüfen, ob Telegram-Sterne möglich sind
    prices: [{ label: `VIP – ${stars} Stars`, amount: stars }]
  });
});

/* =========================
   WEITERE ZAHLUNGEN (EURO)
========================= */
bot.action("OTHER_PAYMENTS", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "💳 Wähle deinen Plan (Euro-Preise):",
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 25 €", "PAY_VIP_EU")],
      [Markup.button.callback("⭐️ Ultra – 50 €", "PAY_ULTRA_EU")],
      [Markup.button.callback("⭐️ Ultra Pro – 100 €", "PAY_ULTRAPRO_EU")],
      [Markup.button.callback("🔞 Ultimate – 150 €", "PAY_ULTIMATE_EU")],
      [Markup.button.callback("⬅️ Zurück", "BACK_TO_START")]
    ])
  );
});

/* =========================
   EURO-ZAHLUNGSINFOS
========================= */
bot.action("PAY_VIP_EU", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "💳 VIP – 25 €\nBitte zahle an PayPal: https://www.paypal.me/BraveSupport\n\n" +
    "📩 Bei Problemen kontaktiere @BraveSupport1"
  );
});

bot.action("PAY_ULTRA_EU", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "💳 Ultra – 50 €\nBitte zahle an PayPal: https://www.paypal.me/BraveSupport\n\n" +
    "📩 Bei Problemen kontaktiere @BraveSupport1"
  );
});

bot.action("PAY_ULTRAPRO_EU", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "💳 Ultra Pro – 100 €\nBitte zahle an PayPal: https://www.paypal.me/BraveSupport\n\n" +
    "📩 Bei Problemen kontaktiere @BraveSupport1"
  );
});

bot.action("PAY_ULTIMATE_EU", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "🔞 Ultimate – 150 €\nBitte zahle an PayPal: https://www.paypal.me/BraveSupport\n\n" +
    "📩 Bei Problemen kontaktiere @BraveSupport1"
  );
});

/* =========================
   ZURÜCK BUTTON
========================= */
bot.action("BACK_TO_START", async (ctx) => {
  await ctx.answerCbQuery();
  const username = ctx.from.first_name || "User";
  ctx.reply(
    `👋 Willkommen zurück bei BRAVE, ${username}!\n\nWähle deinen Plan:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "PAY_1500")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "PAY_2500")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "PAY_5000")],
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "PAY_7500")],
      [Markup.button.callback("💳 Weitere Zahlungsmöglichkeiten", "OTHER_PAYMENTS")]
    ])
  );
});

/* =========================
   PAYMENT EVENTS (STARS)
========================= */
bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

bot.on("successful_payment", async (ctx) => {
  await ctx.reply(
    "✅ Zahlung erfolgreich!\n\n" +
    "👉 Hier ist dein VIP-Zugang:\n" +
    "https://t.me/+_Lwkx_EKnd9lMjJh"
  );
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("BOT GESTARTET");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));