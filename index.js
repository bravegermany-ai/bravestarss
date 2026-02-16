import { Telegraf, Markup, session } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   SESSION MIDDLEWARE
========================= */
bot.use(session());

/* =========================
   STAR PLÄNE
========================= */
const STAR_PLANS = {
  STAR_1500: { stars: 1500, title: "⭐ 1500 Stars", price: 2500, label: "25 €" },
  STAR_2500: { stars: 2500, title: "⭐ 2500 Stars", price: 5000, label: "50 €" },
  STAR_5000: { stars: 5000, title: "⭐ 5000 Stars", price: 10000, label: "100 €" }
};

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
   MAIN MENU
========================= */
const showMainMenu = async (ctx) => {
  await ctx.reply(
    "✨ Wähle dein Star-Paket:",
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐ 1500 Stars – 25 €", "STAR_1500")],
      [Markup.button.callback("⭐ 2500 Stars – 50 €", "STAR_2500")],
      [Markup.button.callback("⭐ 5000 Stars – 100 €", "STAR_5000")]
    ])
  );
};

bot.start(showMainMenu);

/* =========================
   BUTTON HANDLER (TEST-MODUS)
========================= */
bot.action(/STAR_\d+/, async (ctx) => {
  await ctx.answerCbQuery(); // Feedback beim Klick

  const key = ctx.match[0];
  const plan = STAR_PLANS[key];
  const voucherCode = generateCode();

  // Nachricht an User
  await ctx.reply(
    `✅ Du hast das Paket ${plan.title} gewählt (Test-Modus)\n\n` +
    `🎟 Dein Code: ${voucherCode}\n\n` +
    `📩 Bitte sende nun deinen Snapchat-Benutzernamen zusammen mit diesem Code an @SkandalGermany6.`
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
