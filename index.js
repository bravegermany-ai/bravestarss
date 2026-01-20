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
   STAR PAYMENT (direkt bezahlen)
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
    title: `VIP – ${stars} Stars`,
    description: `VIP-Zugang mit ${stars} Telegram-Sternen`,
    payload: `VIP_${stars}_${ctx.from.id}`,
    provider_token: "", // HIER DEIN BOTFATHER PAYMENT TOKEN
    currency: "XTR", // Telegram-Sterne
    prices: [{ label: `VIP – ${stars} Stars`, amount: stars }]
  });
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

bot.on("successful_payment", async (ctx) => {
  await ctx.reply(
    "✅ Zahlung erfolgreich!\n\nBitte kontaktiere jetzt @BraveSupport1, um deinen Zugang freizuschalten."
  );
});

/* =========================
   WEITERE ZAHLUNGEN (EURO)
========================= */
bot.action("OTHER_PAYMENTS", (ctx) => {
  ctx.answerCbQuery();
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
   EURO-STUFEN → ZAHLUNGSMETHODEN
========================= */
const EURO_PRICES = {
  EU_VIP: 25,
  EU_ULTRA: 50,
  EU_ULTRAPRO: 100,
  EU_ULTIMATE: 150
};

const EURO_NAMES = {
  EU_VIP: "VIP",
  EU_ULTRA: "Ultra",
  EU_ULTRAPRO: "Ultra Pro",
  EU_ULTIMATE: "Ultimate"
};

bot.action(/EU_.+/, async (ctx) => {
  await ctx.answerCbQuery();
  const price = EURO_PRICES[ctx.match[0]];
  const name = EURO_NAMES[ctx.match[0]];

  ctx.reply(
    `💳 ${name} – ${price} €\nWähle die Zahlungsmethode:`,
    Markup.inlineKeyboard([
      [Markup.button.url("💳 PayPal", `https://www.paypal.me/BraveSupport/${price}`)],
      [Markup.button.callback("🎁 Amazon", `AMAZON_${ctx.match[0]}`)],
      [Markup.button.callback("💰 Paysafecard", `PSC_${ctx.match[0]}`)],
      [Markup.button.callback("⬅️ Zurück", "OTHER_PAYMENTS")]
    ])
  );
});

/* =========================
   AMAZON / PSC → HINWEIS
========================= */
bot.action(/AMAZON_.+/, async (ctx) => {
  await ctx.answerCbQuery();
  const price = EURO_PRICES[ctx.match[0]];
  ctx.reply(`🎁 Bitte sende einen Amazon-Gutschein im Wert von ${price} € an @BraveSupport1\n📩 Bei Problemen kontaktiere @BraveSupport1`);
});

bot.action(/PSC_.+/, async (ctx) => {
  await ctx.answerCbQuery();
  const price = EURO_PRICES[ctx.match[0]];
  ctx.reply(`💰 Bitte sende eine Paysafecard im Wert von ${price} € an @BraveSupport1\n📩 Bei Problemen kontaktiere @BraveSupport1`);
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
console.log("BOT GESTARTET");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));