import { Telegraf, Markup } from "telegraf";
import { createClient } from "@supabase/supabase-js";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");
if (!process.env.SUPABASE_URL) throw new Error("SUPABASE_URL fehlt");
if (!process.env.SUPABASE_SERVICE_KEY) throw new Error("SUPABASE_SERVICE_KEY fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

/* =========================
   CODE GENERATOR
========================= */
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "BV-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

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
    title: `BRAVE – ${plan.title} – ${plan.price} Stars`,
    description: `Zugang zum Plan: ${plan.title}`,
    payload: JSON.stringify({ name: plan.title, price: plan.price / 100 }),
    provider_token: "",
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
  const telegramUserId = String(ctx.from.id);

  let planInfo = { name: "VIP", price: 0 };
  try {
    planInfo = JSON.parse(payment.invoice_payload);
  } catch (e) {
    console.error("Payload parse error:", e);
  }

  const priceInEuros = payment.total_amount / 100;
  const code = generateCode();

  // Code in Datenbank speichern
  const { error } = await supabase.from("redemption_codes").insert({
    code,
    plan_name: planInfo.name,
    price: priceInEuros,
    telegram_user_id: telegramUserId,
  });

  if (error) {
    console.error("DB error:", error);
    await ctx.reply(
      "⚠️ Zahlung erhalten, aber dein Code konnte nicht erstellt werden.\n\n" +
      "Bitte erstelle ein Ticket in der App unter *Support*.",
      { parse_mode: "Markdown" }
    );
    return;
  }

  // Code an User senden
  await ctx.reply(
    `✅ *Zahlung erfolgreich!*\n\n` +
    `🎁 Dein Einlöse-Code:\n\n` +
    `\`${code}\`\n\n` +
    `📋 Paket: *${planInfo.name}*\n` +
    `💰 Betrag: ${priceInEuros}€`,
    { parse_mode: "Markdown" }
  );

  // Ausführliche Anleitung
  await ctx.reply(
    `📖 *So löst du deinen Code ein:*\n\n` +
    `1️⃣ Öffne  Website\n` +
    `3️⃣ Gehe zu *Profil* (oben rechts)\n` +
    `4️⃣ Dort findest du die Karte *\"Code einlösen\"*\n` +
    `5️⃣ Gib deinen Code ein: \`${code}\`\n` +
    `6️⃣ Klick auf *\"Absenden\"*\n` +
    `7️⃣ ✅ Dein ${planInfo.name} Paket ist sofort aktiv!\n\n` +
    `⏱️ Code verfällt nicht\n` +
    `❓ Problem? Erstelle ein Ticket in der App unter *Support*`,
    { parse_mode: "Markdown" }
  );
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("🤖 BRAVE BOT GESTARTET");

bot.catch((err, ctx) => {
  console.error(`Fehler bei UpdateType ${ctx.updateType}:`, err);
});
