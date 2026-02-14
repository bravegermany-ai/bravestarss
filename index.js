import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   BUTTONS
========================= */
const MAIN_MENU_BUTTON = Markup.button.callback("🏠 Hauptmenü", "MAIN_MENU");

/* =========================
   STAR PLÄNE
========================= */
const STAR_PLANS = {
  STAR_1500: { price: 1500, title: "VIP" },
  STAR_2500: { price: 2500, title: "Ultra" },
  STAR_5000: { price: 5000, title: "Ultra Pro" },
  STAR_7500: { price: 7500, title: "Ultimate 🔞" },
};

/* =========================
   START / MAIN MENU
========================= */
const showMainMenu = async (ctx, textPrefix = "👋 Willkommen") => {
  const username = ctx.from.first_name || "User";

  await ctx.reply(
    `${textPrefix}, ${username}!\n\nWähle deinen Plan:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "STAR_1500")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "STAR_2500")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "STAR_5000")],
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "STAR_7500")]
    ])
  );
};

bot.start((ctx) => showMainMenu(ctx));

bot.action("MAIN_MENU", async (ctx) => {
  await ctx.answerCbQuery();
  await showMainMenu(ctx, "🏠 Hauptmenü");
});

/* =========================
   STAR PAYMENT
========================= */
bot.action(/STAR_\d+/, async (ctx) => {
  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");

  const key = ctx.match?.[0];
  if (!key || !STAR_PLANS[key]) {
    return await ctx.reply("❌ Ungültiger Plan!");
  }

  const plan = STAR_PLANS[key];

  await ctx.replyWithInvoice({
    title: `SKANDAL – ${plan.title} – ${plan.price} Stars`,
    description: `Zugang zum Plan: ${plan.title}`,
    payload: `SKANDAL_${plan.price}_${ctx.from.id}`,
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
  return `SK-${timestamp}-${random}`;
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
    `📦 Produkt: ${payment.invoice_payload}\n` +
    `📅 Datum: ${new Date().toLocaleString("de-DE")}\n\n` +
    `📩 *Wichtig:* Sende diese Belegnummer jetzt an @skandalgermany6,\n` +
    `um deinen Zugang freizuschalten.`,
    { parse_mode: "Markdown" }
  );
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("🤖 SKANDAL BOT GESTARTET");

/* =========================
   ERROR HANDLER
========================= */
bot.catch((err, ctx) => {
  console.error(`Fehler bei UpdateType ${ctx.updateType}:`, err);
});