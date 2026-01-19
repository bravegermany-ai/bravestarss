import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN fehlt");
}

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   KONFIG
========================= */
const VIP_GROUP_LINK = "https://t.me/+_Lwkx_EKnd9lMjJh";

/* =========================
   VIP-INHALTE
========================= */
const VIP_CONTENT = `
✨ *VIP – 10 €* ✨

━━━━━━━━━━━━━━━━━━
📦 *INHALTE*
💎 Tägliche Updates
💰 Inhalt im Wert von 10.000€
👥 Community Forum
⬇️ Download-Funktion
🚫 Keine Wasserzeichen
⭐ OnlyFans Zugang
💠 Influencer Zugang
📲 Social Media Leaks
👻 Snapchat Leaks Ordner
🔒 Private Telegram Gruppe
💬 Live-Chat mit Frauen
🗳️ Votings & Mitbestimmung
🎉 Gewinnspiele | Verlosungen
🎥 8K Video Qualität
⚡ 24/7 High End Support
━━━━━━━━━━━━━━━━━━
`;

/* =========================
   START
========================= */
bot.start((ctx) => {
  ctx.reply(
    "🔥 BRAVE VIP 🔥\n\n🚀 Wähle deine Zahlungsmethode (alle 10 €):",
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐ Telegram-Sterne – 10 €", "PAY_STARS")],
      [Markup.button.url("💳 PayPal – 10 €", "https://www.paypal.me/BraveSupport")],
      [Markup.button.callback("🎁 Amazon – 10 €", "PAY_AMAZON")],
      [Markup.button.callback("💰 Paysafecard – 10 €", "PAY_PSC")]
    ])
  );
});

/* =========================
   TELEGRAM STERNE INFO + ZAHLUNG
========================= */
bot.action("PAY_STARS", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply(
    VIP_CONTENT + "\n\n💳 Klicke unten, um die Zahlung mit 500 Telegram-Sternen zu starten:",
    Markup.inlineKeyboard([
      [Markup.button.callback("💎 Jetzt mit 500 Sternen zahlen", "START_STARS_PAYMENT")]
    ]),
    { parse_mode: "Markdown" }
  );
});

bot.action("START_STARS_PAYMENT", async (ctx) => {
  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");
  return ctx.replyWithInvoice({
    title: "VIP – 10 €",
    description: "BRAVE VIP – 10 €",
    payload: `VIP_${ctx.from.id}`,
    provider_token: "", // BOTFATHER PAYMENT TOKEN
    currency: "XTR",
    prices: [{ label: "VIP – 500 Sterne", amount: 500 }]
  });
});

/* =========================
   AMAZON / PSC BUTTONS
========================= */
bot.action("PAY_AMAZON", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply(
    "🎁 Bitte sende deinen Amazon-Gutschein-Code oder Screenshot (10 €) direkt an @BraveSupport1.\n\n" +
    VIP_CONTENT
  );
});

bot.action("PAY_PSC", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply(
    "💰 Bitte sende deinen Paysafecard-Code (10 €) direkt an @BraveSupport1.\n\n" +
    VIP_CONTENT
  );
});

/* =========================
   PAYMENT EVENTS (STARS)
========================= */
bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

bot.on("successful_payment", async (ctx) => {
  await ctx.reply(
    "✅ Zahlung erfolgreich! (10 €)\n\n" +
    VIP_CONTENT +
    "\n\n👉 Klicke unten, um deine VIP-Gruppe zu betreten:",
    Markup.inlineKeyboard([
      [Markup.button.url("⭐ VIP-GRUPPE ⭐", VIP_GROUP_LINK)]
    ]),
    { parse_mode: "Markdown" }
  );
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("BOT GESTARTET");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));