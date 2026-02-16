import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

const STAR_PLANS = {
  STAR_1500: { price: 25, title: "1500 Stars (25€)" },
  STAR_5000: { price: 120, title: "5000 Stars (120€)" },
};

/* =========================
   RANDOM CODE GENERATOR
========================= */
function generateCode(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return "SK-" + result;
}

/* =========================
   MAIN MENU
========================= */
const showMainMenu = async (ctx) => {
  await ctx.reply(
    `Wähle eine Option:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("1500 Sterne – 25€", "STAR_1500")],
      [Markup.button.callback("5000 Sterne – 120€", "STAR_5000")]
    ])
  );
};

bot.start((ctx) => showMainMenu(ctx));

/* =========================
   PAYMENT
========================= */
bot.action(/STAR_\d+/, async (ctx) => {
  await ctx.answerCbQuery();

  const key = ctx.match?.[0];
  if (!key || !STAR_PLANS[key]) {
    return await ctx.reply("Ungültiger Plan");
  }

  const plan = STAR_PLANS[key];

  await ctx.replyWithInvoice({
    title: plan.title,
    description: plan.title,
    payload: `PLAN_${key}`,
    provider_token: "",
    currency: "EUR",
    prices: [
      { label: plan.title, amount: plan.price * 100 } // Euro in Cent
    ]
  });
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

/* =========================
   SUCCESS
========================= */
bot.on("successful_payment", async (ctx) => {
  const voucherCode = generateCode();

  await ctx.reply(
    `✅ Zahlung erfolgreich!\n\n` +
    `🎟 Dein Code:\n` +
    `🔑 ${voucherCode}\n\n` +
    `📩 Sende diesen Code an @SkandalGermany6 um deinen Zugang zu erhalten.`
  );
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("BOT GESTARTET");

bot.catch((err, ctx) => {
  console.error(`Fehler bei ${ctx.updateType}:`, err);
});
