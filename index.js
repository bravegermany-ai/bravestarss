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
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "STAR_VIP")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "STAR_ULTRA")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "STAR_ULTRAPRO")],
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "STAR_ULTIMATE")],
      [Markup.button.callback("💳 Weitere Zahlungsmöglichkeiten", "OTHER_PAYMENTS")]
    ])
  );
});

/* =========================
   STERNE-STUFEN (Kontakt mit Admin)
========================= */
const STAR_MESSAGES: { [key: string]: string } = {
  STAR_VIP: "⭐️ VIP – 1.500 Stars\n💳 Bitte schreibe zuerst an @BraveSupport1, um die Zahlung zu starten\n📩 Bei Problemen kontaktiere @BraveSupport1",
  STAR_ULTRA: "⭐️ Ultra – 2.500 Stars\n💳 Bitte schreibe zuerst an @BraveSupport1, um die Zahlung zu starten\n📩 Bei Problemen kontaktiere @BraveSupport1",
  STAR_ULTRAPRO: "⭐️ Ultra Pro – 5.000 Stars\n💳 Bitte schreibe zuerst an @BraveSupport1, um die Zahlung zu starten\n📩 Bei Problemen kontaktiere @BraveSupport1",
  STAR_ULTIMATE: "🔞 Ultimate – 7.500 Stars\n💳 Bitte schreibe zuerst an @BraveSupport1, um die Zahlung zu starten\n📩 Bei Problemen kontaktiere @BraveSupport1",
};

bot.action(/STAR_.+/, async (ctx) => {
  await ctx.answerCbQuery();
  const msg = STAR_MESSAGES[ctx.match[0]];
  if (msg) {
    ctx.reply(msg);
  }
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
   EURO-ZAHLUNGSINFOS (kein Link)
========================= */
const EURO_MESSAGES: { [key: string]: string } = {
  PAY_VIP_EU: "⭐️ VIP – 25 €\n💳 Bitte sende den Betrag direkt an @BraveSupport1\n📩 Bei Problemen kontaktiere @BraveSupport1",
  PAY_ULTRA_EU: "⭐️ Ultra – 50 €\n💳 Bitte sende den Betrag direkt an @BraveSupport1\n📩 Bei Problemen kontaktiere @BraveSupport1",
  PAY_ULTRAPRO_EU: "⭐️ Ultra Pro – 100 €\n💳 Bitte sende den Betrag direkt an @BraveSupport1\n📩 Bei Problemen kontaktiere @BraveSupport1",
  PAY_ULTIMATE_EU: "🔞 Ultimate – 150 €\n💳 Bitte sende den Betrag direkt an @BraveSupport1\n📩 Bei Problemen kontaktiere @BraveSupport1",
};

bot.action(/PAY_.+/, async (ctx) => {
  await ctx.answerCbQuery();
  const msg = EURO_MESSAGES[ctx.match[0]];
  if (msg) {
    ctx.reply(msg);
  }
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
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "STAR_VIP")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "STAR_ULTRA")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "STAR_ULTRAPRO")],
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "STAR_ULTIMATE")],
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