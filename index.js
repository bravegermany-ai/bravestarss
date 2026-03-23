import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   BUTTONS
========================= */
const MAIN_MENU_BUTTON = Markup.button.callback("🏠 Hauptmenü", "MAIN_MENU");

/* =========================
   RANDOM CODE GENERATOR
========================= */
function generateCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return "SK-" + result;
}

/* =========================
   START / MAIN MENU
========================= */
const showMainMenu = async (ctx, textPrefix = "👋 Willkommen") => {
  const username = ctx.from.first_name || "User";

  await ctx.reply(
    `${textPrefix}, ${username}!\n\n👻 Snap Tool\n\nWähle deinen Plan:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("👻 1 Account — 1.250 ⭐", "PLAN_1")],
      [Markup.button.callback("🔥 3 Accounts — 2.500 ⭐", "PLAN_3")],
      [Markup.button.callback("💎 Lifetime — 7.500 ⭐", "PLAN_LIFE")]
    ])
  );
};

bot.start((ctx) => showMainMenu(ctx));

bot.action("MAIN_MENU", async (ctx) => {
  await ctx.answerCbQuery();
  await showMainMenu(ctx, "🏠 Hauptmenü");
});

/* =========================
   STAR PAYMENTS
========================= */
const STAR_PLANS = {
  PLAN_1: {
    stars: 1250,
    title: "👻 1 Account",
    amount: 1250,
    label: "1 Account"
  },
  PLAN_3: {
    stars: 2500,
    title: "🔥 3 Accounts",
    amount: 2500,
    label: "3 Accounts"
  },
  PLAN_LIFE: {
    stars: 7500,
    title: "💎 Lifetime",
    amount: 7500,
    label: "Lifetime Zugang"
  }
};

bot.action(/PLAN_.+/, async (ctx) => {
  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");
  const key = ctx.match[0];
  const plan = STAR_PLANS[key];

  if (!plan) return ctx.reply("❌ Ungültiger Plan");

  await ctx.replyWithInvoice({
    title: plan.title,
    description: `Bezahlung mit ${plan.stars} Telegram-Stars`,
    payload: `STARS_${key}_${ctx.from.id}`,
    provider_token: "DEIN_PROVIDER_TOKEN_HIER",
    currency: "XTR",
    prices: [{ label: plan.label, amount: plan.amount }]
  });
});

/* =========================
   PRE CHECKOUT
========================= */
bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

/* =========================
   SUCCESSFUL PAYMENT
========================= */
bot.on("successful_payment", async (ctx) => {
  const voucherCode = generateCode();

  await ctx.reply(
    `✅ Zahlung erfolgreich!\n\n` +
    `🎟 Dein Code: ${voucherCode}\n\n` +
    `📩 Bitte sende jetzt deinen Snapchat-Benutzernamen zusammen mit diesem Code an @SkandalGermany6.`
  );
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("🤖 BOT GESTARTET");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

/* =========================
   ERROR HANDLER
========================= */
bot.catch((err, ctx) => {
  console.error(`Fehler bei UpdateType ${ctx.updateType}:`, err);
});