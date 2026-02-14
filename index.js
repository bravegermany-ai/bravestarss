import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   STAR PLÄNE
========================= */
const STAR_PLANS = {
  STAR_1500: { price: 1500, title: "VIP", code: "BV-VIP25EUR" },
  STAR_2500: { price: 2500, title: "Ultra", code: "BV-ULTRA50E" },
  STAR_5000: { price: 5000, title: "Ultra Pro", code: "BV-UPRO100E" },
  STAR_7500: { price: 7500, title: "Ultimate 🔞", code: "BV-ULTI150E" },
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
    payload: `PLAN_${key}`,
    provider_token: "", // ⭐ HIER DEIN TELEGRAM PROVIDER TOKEN EINTRAGEN
    currency: "XTR",
    prices: [{ label: `${plan.price} Stars`, amount: plan.price }]
  });
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

/* =========================
   SUCCESSFUL PAYMENT
========================= */
bot.on("successful_payment", async (ctx) => {
  const payment = ctx.message.successful_payment;
  const user = ctx.from.first_name || "User";

  const payloadKey = payment.invoice_payload.replace("PLAN_", "");
  const plan = STAR_PLANS[payloadKey];

  if (!plan) return;

  await ctx.reply(
    `✅ *Zahlung erfolgreich!*\n\n` +
    `🎉 Danke für deinen Kauf, ${user}!\n\n` +
    `📦 *Dein Plan:* ${plan.title}\n\n` +
    `🌐 *So erhältst du deinen Zugang:*\n` +
    `1️⃣ Gehe auf dein Profil auf der Website\n` +
    `2️⃣ Öffne den Bereich *„Einlösen“*\n` +
    `3️⃣ Gib folgenden Code ein:\n\n` +
    `🔑 \`${plan.code}\`\n\n` +
    `🔥 Danach kannst du deinen Inhalt genießen!`,
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