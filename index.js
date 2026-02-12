import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   BUTTONS
========================= */
const MAIN_MENU_BUTTON = Markup.button.callback("🏠 Hauptmenü", "MAIN_MENU");

/* =========================
   STAR PLAN (NUR VIP)
========================= */
const STAR_PLAN = {
  STAR_VIP: { price: 500, title: "VIP" }
};

/* =========================
   START / MAIN MENU
========================= */
const showMainMenu = async (ctx, textPrefix = "👋 Willkommen") => {
  const username = ctx.from.first_name || "User";

  await ctx.reply(
    `${textPrefix}, ${username}!\n\nWähle deinen Plan:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 500 Stars", "STAR_VIP")],
      [Markup.button.callback("💳 Zahlung mit Euro – 10 €", "EU_VIP10")]
    ])
  );
};

bot.start((ctx) => showMainMenu(ctx));
bot.action("MAIN_MENU", async (ctx) => {
  await ctx.answerCbQuery();
  await showMainMenu(ctx, "🏠 Hauptmenü");
});

/* =========================
   STAR PAYMENT (500 STARS)
========================= */
bot.action("STAR_VIP", async (ctx) => {
  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");

  const plan = STAR_PLAN.STAR_VIP;

  await ctx.replyWithInvoice({
    title: `VIP – ${plan.price} Stars`,
    description: `Zugang zum Plan: ${plan.title}`,
    payload: `VIP_${plan.price}_${ctx.from.id}`,
    provider_token: "", // BOTFATHER TOKEN HIER EINTRAGEN
    currency: "XTR",
    prices: [{ label: `${plan.price} Stars`, amount: plan.price }]
  });
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

/* =========================
   BELEG GENERIEREN
========================= */
function generateReceiptNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VIP-${timestamp}-${random}`;
}

/* =========================
   SUCCESSFUL PAYMENT
========================= */
bot.on("successful_payment", async (ctx) => {
  const payment = ctx.message.successful_payment;
  const receiptNumber = generateReceiptNumber();
  const user = ctx.from.first_name || "User";

  await ctx.reply(
    `🟢 *Zahlung erfolgreich bestätigt!*\n\n` +
    `🧾 *Belegnummer:* \`${receiptNumber}\`\n` +
    `👤 Kunde: ${user}\n` +
    `💰 Betrag: ${payment.total_amount} ${payment.currency}\n` +
    `📦 Produkt: VIP\n` +
    `📅 Datum: ${new Date().toLocaleString("de-DE")}\n\n` +
    `📩 Sende diese Belegnummer an @skandalgermany6,\n` +
    `um deinen Zugang freizuschalten.`,
    { parse_mode: "Markdown" }
  );
});

/* =========================
   EURO ZAHLUNG (10€)
========================= */
bot.action("EU_VIP10", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `💳 *Euro Zahlung – VIP*\n\n` +
    `Sende bitte *10 €* per:\n\n` +
    `🎁 Amazon Gutschein\n` +
    `💰 Paysafecard\n` +
    `🅿️ PayPal\n\n` +
    `➡️ an @skandalgermany6\n\n` +
    `Nach Zahlung erhältst du deinen Zugang.`,
    {
      parse_mode: "Markdown",
      reply_markup: Markup.inlineKeyboard([[MAIN_MENU_BUTTON]])
    }
  );
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("🤖 BOT GESTARTET");

/* =========================
   ERROR HANDLER
========================= */
bot.catch((err, ctx) => {
  console.error(`Fehler bei UpdateType ${ctx.updateType}:`, err);
});