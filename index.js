import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   ADMIN CHAT
========================= */
const ADMIN_CHAT_ID = "@BraveSupport1";

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
  const payment = ctx.message.successful_payment;
  const user = ctx.from;
  const stars = payment.total_amount;

  await ctx.reply(
    `✅ Zahlung erfolgreich!\n\nHier ist dein Zugang: [Klicke hier](https://t.me/+_Lwkx_EKnd9lMjJh)`,
    { parse_mode: "Markdown" }
  );

  await ctx.telegram.sendMessage(
    ADMIN_CHAT_ID,
    `⭐️ *Neue Stars-Zahlung!*\n\n👤 ${user.first_name} (@${user.username || "kein_username"})\n🆔 ID: ${user.id}\n💫 Stars: ${stars}`,
    { parse_mode: "Markdown" }
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
const paypalButton = Markup.button.url(
  "💳 PayPal",
  "https://www.paypal.me/BraveSupport2"
);

bot.action("EU_VIP", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "⭐️ VIP – 25 €\nWähle die Zahlungsmethode:",
    Markup.inlineKeyboard([
      [paypalButton],
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
      [paypalButton],
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
      [paypalButton],
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
      [paypalButton],
      [Markup.button.callback("🎁 Amazon", "AMAZON_EU_ULTIMATE")],
      [Markup.button.callback("💰 Paysafecard", "PSC_EU_ULTIMATE")],
      [Markup.button.callback("⬅️ Zurück", "OTHER_PAYMENTS")]
    ])
  );
});

/* =========================
   AMAZON + ADMIN INFO
========================= */
const AMAZON_MESSAGES = {
  EU_VIP: 25,
  EU_ULTRA: 50,
  EU_ULTRAPRO: 100,
  EU_ULTIMATE: 150,
};

Object.entries(AMAZON_MESSAGES).forEach(([key, value]) => {
  bot.action(`AMAZON_${key}`, async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.telegram.sendMessage(
      ADMIN_CHAT_ID,
      `🎁 *Amazon Zahlung ausgewählt*\n\n👤 ${ctx.from.first_name} (@${ctx.from.username || "kein_username"})\n🆔 ID: ${ctx.from.id}\n💶 Betrag: ${value} €`,
      { parse_mode: "Markdown" }
    );

    ctx.reply(
      `🎁 Bitte sende einen Amazon-Gutschein im Wert von ${value} € an @BraveSupport1\n📩 Bei Problemen kontaktiere @BraveSupport1`
    );
  });
});

/* =========================
   PAYSAFECARD + ADMIN INFO
========================= */
const PSC_MESSAGES = {
  EU_VIP: 25,
  EU_ULTRA: 50,
  EU_ULTRAPRO: 100,
  EU_ULTIMATE: 150,
};

Object.entries(PSC_MESSAGES).forEach(([key, value]) => {
  bot.action(`PSC_${key}`, async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.telegram.sendMessage(
      ADMIN_CHAT_ID,
      `💰 *Paysafecard Zahlung ausgewählt*\n\n👤 ${ctx.from.first_name} (@${ctx.from.username || "kein_username"})\n🆔 ID: ${ctx.from.id}\n💶 Betrag: ${value} €`,
      { parse_mode: "Markdown" }
    );

    ctx.reply(
      `💰 Bitte sende eine Paysafecard im Wert von ${value} € an @BraveSupport1\n📩 Bei Problemen kontaktiere @BraveSupport1`
    );
  });
});

/* =========================
   BACK
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
