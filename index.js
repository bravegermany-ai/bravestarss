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
    "🔥 BRAVE VIP 🔥\n\n🚀 Wähle deine Zahlungsmethode:",
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐ Telegram-Sterne – 10 €", "PAY_STARS")],
      [Markup.button.callback("💳 PayPal", "PAY_PAYPAL")],
      [Markup.button.callback("🎁 Amazon", "PAY_AMAZON")],
      [Markup.button.callback("💰 Paysafecard", "PAY_PSC")]
    ])
  );
});

/* =========================
   TELEGRAM STERNE ZAHLUNG
========================= */
bot.action("PAY_STARS", async (ctx) => {
  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");
  return ctx.replyWithInvoice({
    title: "VIP",
    description: "BRAVE VIP – 10 €",
    payload: `VIP_${ctx.from.id}`,
    provider_token: "", // BOTFATHER PAYMENT TOKEN
    currency: "XTR",
    prices: [{ label: "VIP – 500 Sterne", amount: 500 }]
  });
});

/* =========================
   PAYPAL / AMAZON / PAYSAFE BUTTONS
========================= */
bot.action("PAY_PAYPAL", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply(
    "💳 Bitte zahle über PayPal: https://www.paypal.me/BraveSupport\n\n" +
    "📩 Sende danach deinen Zahlungsbeleg direkt an @BraveSupport1, damit dein VIP-Zugang freigeschaltet werden kann."
  );
});

bot.action("PAY_AMAZON", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply(
    "🎁 Bitte sende deinen Amazon-Gutschein-Code oder Screenshot direkt an @BraveSupport1, damit dein VIP-Zugang freigeschaltet werden kann."
  );
});

bot.action("PAY_PSC", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply(
    "💰 Bitte sende deinen Paysafecard-Code direkt an @BraveSupport1, damit dein VIP-Zugang freigeschaltet werden kann."
  );
});

/* =========================
   PAYMENT EVENTS (STARS)
========================= */
bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

bot.on("successful_payment", async (ctx) => {
  await ctx.reply(
    "✅ Zahlung erfolgreich!\n\n" +
    "👉 Klicke unten, um deine VIP-Inhalte zu erhalten:",
    Markup.inlineKeyboard([
      [
        Markup.button.url("⭐ VIP-GRUPPE ⭐", VIP_GROUP_LINK)
      ]
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