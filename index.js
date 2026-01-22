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
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "STAR_1500")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "STAR_2500")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "STAR_5000")],
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "STAR_7500")],
      [Markup.button.callback("💳 Weitere Zahlungsmöglichkeiten", "OTHER_PAYMENTS")]
    ])
  );
});

/* =========================
   STAR PAYMENT
========================= */
const STAR_PRICES = {
  STAR_1500: 1500,
  STAR_2500: 2500,
  STAR_5000: 5000,
  STAR_7500: 7500,
};

bot.action(/STAR_\d+/, async (ctx) => {
  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");
  const stars = STAR_PRICES[ctx.match[0]];

  return ctx.replyWithInvoice({
    title: `BRAVE – ${stars} Stars`,
    description: `Zugang mit ${stars} Telegram-Sternen`,
    payload: `BRAVE_${stars}_${ctx.from.id}`,
    provider_token: "", // BOTFATHER PAYMENT TOKEN
    currency: "XTR",
    prices: [{ label: `${stars} Stars`, amount: stars }]
  });
});

bot.on("pre_checkout_query", (ctx) =>
  ctx.answerPreCheckoutQuery(true)
);

bot.on("successful_payment", async (ctx) => {
  await ctx.reply(
    "✅ Zahlung erfolgreich!\n\nBitte kontaktiere jetzt @BraveSupport1, um deinen Zugang freizuschalten."
  );
});

/* =========================
   EURO STUFEN
========================= */
bot.action("OTHER_PAYMENTS", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "💳 Wähle deinen Plan (Euro-Preise):",
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 25 €", "EU_VIP")],
      [Markup.button.callback("⭐️ Ultra – 50 €", "EU_ULTRA")],
      [Markup.button.callback("⭐️ Ultra Pro – 100 €", "EU_ULTRAPRO")],
      [Markup.button.callback("🔞 Ultimate – 150 €", "EU_ULTIMATE")],
      [Markup.button.callback("⬅️ Zurück", "BACK_TO_START")]
    ])
  );
});

/* =========================
   EURO → ZAHLUNGSMETHODEN
========================= */
bot.action("EU_VIP", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "⭐️ VIP – 25 €\nWähle die Zahlungsmethode:",
    Markup.inlineKeyboard([
      [Markup.button.url("💳 PayPal", "https://www.paypal.me/BraveSupport/25")],
      [Markup.button.callback("🎁 Amazon", "AMAZON_EU_VIP")],
      [Markup.button.callback("💰 Paysafecard", "PSC_EU_VIP")],
      [Markup.button.callback("⬅️ Zurück", "OTHER_PAYMENTS")]
    ])
  );
});

bot.action("EU_ULTRA", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "⭐️ Ultra – 50 €\nWähle die Zahlungsmethode:",
    Markup.inlineKeyboard([
      [Markup.button.url("💳 PayPal", "https://www.paypal.me/BraveSupport/50")],
      [Markup.button.callback("🎁 Amazon", "AMAZON_EU_ULTRA")],
      [Markup.button.callback("💰 Paysafecard", "PSC_EU_ULTRA")],
      [Markup.button.callback("⬅️ Zurück", "OTHER_PAYMENTS")]
    ])
  );
});

bot.action("EU_ULTRAPRO", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "⭐️ Ultra Pro – 100 €\nWähle die Zahlungsmethode:",
    Markup.inlineKeyboard([
      [Markup.button.url("💳 PayPal", "https://www.paypal.me/BraveSupport/100")],
      [Markup.button.callback("🎁 Amazon", "AMAZON_EU_ULTRAPRO")],
      [Markup.button.callback("💰 Paysafecard", "PSC_EU_ULTRAPRO")],
      [Markup.button.callback("⬅️ Zurück", "OTHER_PAYMENTS")]
    ])
  );
});

bot.action("EU_ULTIMATE", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "🔞 Ultimate – 150 €\nWähle die Zahlungsmethode:",
    Markup.inlineKeyboard([
      [Markup.button.url("💳 PayPal", "https://www.paypal.me/BraveSupport/150")],
      [Markup.button.callback("🎁 Amazon", "AMAZON_EU_ULTIMATE")],
      [Markup.button.callback("💰 Paysafecard", "PSC_EU_ULTIMATE")],
      [Markup.button.callback("⬅️ Zurück", "OTHER_PAYMENTS")]
    ])
  );
});

/* =========================
   AMAZON HINWEISE
========================= */
bot.action("AMAZON_EU_VIP", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("🎁 Bitte sende einen Amazon-Gutschein im Wert von 25 € an @BraveSupport1");
});

bot.action("AMAZON_EU_ULTRA", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("🎁 Bitte sende einen Amazon-Gutschein im Wert von 50 € an @BraveSupport1");
});

bot.action("AMAZON_EU_ULTRAPRO", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("🎁 Bitte sende einen Amazon-Gutschein im Wert von 100 € an @BraveSupport1");
});

bot.action("AMAZON_EU_ULTIMATE", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("🎁 Bitte sende einen Amazon-Gutschein im Wert von 150 € an @BraveSupport1");
});

/* =========================
   PAYSAFECARD HINWEISE
========================= */
bot.action("PSC_EU_VIP", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("💰 Bitte sende eine Paysafecard im Wert von 25 € an @BraveSupport1");
});

bot.action("PSC_EU_ULTRA", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("💰 Bitte sende eine Paysafecard im Wert von 50 € an @BraveSupport1");
});

bot.action("PSC_EU_ULTRAPRO", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("💰 Bitte sende eine Paysafecard im Wert von 100 € an @BraveSupport1");
});

bot.action("PSC_EU_ULTIMATE", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("💰 Bitte sende eine Paysafecard im Wert von 150 € an @BraveSupport1");
});

/* =========================
   BACK BUTTON
========================= */
bot.action("BACK_TO_START", async (ctx) => {
  await ctx.answerCbQuery();
  const username = ctx.from.first_name || "User";
  ctx.reply(
    `👋 Willkommen zurück bei BRAVE, ${username}!\n\nWähle deinen Plan:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "STAR_1500")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "STAR_2500")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "STAR_5000")],
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "STAR_7500")],
      [Markup.button.callback("💳 Weitere Zahlungsmöglichkeiten", "OTHER_PAYMENTS")]
    ])
  );
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("🤖 BOT GESTARTET");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));