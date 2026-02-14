import { Telegraf, Markup } from "telegraf";
import { createClient } from "@supabase/supabase-js";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");
if (!process.env.SUPABASE_URL) throw new Error("SUPABASE_URL fehlt");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/* ========================= STAR PLÄNE ========================= */
const STAR_PLANS = {
  STAR_1500: { price: 1500, title: "VIP", euros: 25 },
  STAR_2500: { price: 2500, title: "Ultra", euros: 50 },
  STAR_5000: { price: 5000, title: "Ultra Pro", euros: 100 },
  STAR_7500: { price: 7500, title: "Ultimate", euros: 150 },
};

/* ========================= CODE GENERATOR ========================= */
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "BV-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/* ========================= START / MAIN MENU ========================= */
const showMainMenu = async (ctx, textPrefix = "👋 Willkommen") => {
  const username = ctx.from.first_name || "User";

  await ctx.reply(
    `${textPrefix}, ${username}!\n\nWähle deinen Plan:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "STAR_1500")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "STAR_2500")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "STAR_5000")],
      [Markup.button.callback("⭐️ Ultimate – 7.500 Stars", "STAR_7500")],
    ])
  );
};

bot.start((ctx) => showMainMenu(ctx));

bot.action("MAIN_MENU", async (ctx) => {
  await ctx.answerCbQuery();
  await showMainMenu(ctx, "🏠 Hauptmenü");
});

/* ========================= STAR PAYMENT ========================= */
bot.action(/STAR_\d+/, async (ctx) => {
  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");

  const key = ctx.match?.[0];
  if (!key || !STAR_PLANS[key]) {
    return await ctx.reply("❌ Ungültiger Plan!");
  }

  const plan = STAR_PLANS[key];

  await ctx.replyWithInvoice({
    title: `${plan.title} – ${plan.price} Stars`,
    description: `Lifetime Zugang zum ${plan.title} Paket`,
    payload: JSON.stringify({ name: plan.title, price: plan.euros }),
    provider_token: "",
    currency: "XTR",
    prices: [{ label: `${plan.price} Stars`, amount: plan.price }],
  });
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

/* ========================= SUCCESSFUL PAYMENT ========================= */
bot.on("successful_payment", async (ctx) => {
  const payment = ctx.message.successful_payment;
  const telegramUserId = String(ctx.from.id);

  let planInfo = { name: "VIP", price: 25 };
  try {
    if (payment.invoice_payload) {
      planInfo = JSON.parse(payment.invoice_payload);
    }
  } catch (e) {
    console.error("Payload parse error:", e);
  }

  const code = generateCode();

  // Code in Datenbank speichern
  const { error } = await supabase.from("redemption_codes").insert({
    code,
    plan_name: planInfo.name,
    price: planInfo.price,
    telegram_user_id: telegramUserId,
  });

  if (error) {
    console.error("DB Fehler:", error);
    return await ctx.reply("❌ Fehler beim Erstellen deines Codes. Bitte kontaktiere den Support.");
  }

  // Code + Anleitung senden
  await ctx.reply(
    `✅ *Zahlung erfolgreich!*\n\n` +
    `🎁 *Dein Einlöse-Code:*\n\n` +
    `\`${code}\`\n\n` +
    `📋 Paket: *${planInfo.name}*\n` +
    `💰 Betrag: ${planInfo.price}€\n\n` +
    `📖 *So löst du deinen Code ein:*\n\n` +
    `1️⃣ Öffne unsere Website\n` +
    `2️⃣ Gehe zu *Profil*\n` +
    `3️⃣ Nutze *"Code einlösen"*\n` +
    `4️⃣ Gib den Code ein\n` +
    `5️⃣ Fertig! ✅ Dein Paket ist aktiv\n\n` +
    `⏱️ Code verfällt nicht\n` +
    `❓ Problem? Erstelle ein Ticket im Support`,
    { parse_mode: "Markdown" }
  );
});

/* ========================= START BOT ========================= */
bot.launch({ dropPendingUpdates: true });
console.log("🤖 Bot gestartet");

bot.catch((err, ctx) => {
  console.error(`Fehler bei ${ctx.updateType}:`, err);
});
