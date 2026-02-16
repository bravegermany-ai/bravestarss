import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

const STAR_PLANS = {
  STAR_1500: { price: 1500, title: "1500 Stars" },
  STAR_2500: { price: 2500, title: "2500 Stars" },
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
      [Markup.button.callback("1500", "STAR_1500")],
      [Markup.button.callback("2500", "STAR_2500")]
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
    currency: "XTR",
    prices: [{ label: `${plan.price} Stars`, amount: plan.price }]
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