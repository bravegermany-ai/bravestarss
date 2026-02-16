import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   STAR PLÄNE
========================= */
const STAR_PLANS = {
  STAR_1500: { stars: 1500, title: "⭐ 1500 Stars" },
  STAR_5000: { stars: 5000, title: "⭐ 5000 Stars" },
};

/* =========================
   RANDOM CODE GENERATOR
========================= */
function generateCode(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return "SK-" + result;
}

/* =========================
   MAIN MENU
========================= */
const showMainMenu = async (ctx) => {
  await ctx.reply(
    "✨ Wähle dein Star-Paket:",
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐ 1500 Stars", "STAR_1500")],
      [Markup.button.callback("⭐ 5000 Stars", "STAR_5000")]
    ])
  );
};

bot.start(showMainMenu);

/* =========================
   STARS PAYMENT
========================= */
bot.action(/STAR_\d+/, async (ctx) => {
  await ctx.answerCbQuery();

  const key = ctx.match[0];
  const plan = STAR_PLANS[key];

  if (!plan) return ctx.reply("❌ Ungültiger Plan");

  await ctx.replyWithInvoice({
    title: plan.title,
    description: `Bezahlung mit ⭐ Telegram Stars`,
    payload: `STARS_${key}`,
    provider_token: "", // ⭐ MUSS leer sein
    currency: "XTR",
    prices: [
      { label: `⭐ ${plan.stars} Stars`, amount: plan.stars }
    ]
  });
});

/* =========================
   PRE CHECKOUT
========================= */
bot.on("pre_checkout_query", (ctx) =>
  ctx.answerPreCheckoutQuery(true)
);

/* =========================
   SUCCESS
========================= */
bot.on("successful_payment", async (ctx) => {
  const voucherCode = generateCode();

  await ctx.reply(
    `✅ Zahlung erfolgreich!\n\n` +
    `🎟 Dein Code:\n` +
    `🔑 ${voucherCode}\n\n` +
    `📩 Sende diesen Code an @SkandalGermany6`
  );
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("🚀 BOT GESTARTET");

bot.catch((err, ctx) => {
  console.error(`Fehler bei ${ctx.updateType}:`, err);
});
