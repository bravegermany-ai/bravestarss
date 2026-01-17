import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN fehlt");
}

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   PAKETE
========================= */
const PACKAGES = {
  BASIC: {
    name: "Basic VIP",
    stars: 1000,
    info: `
⭐ BASIC VIP – 25 €

━━━━━━━━━━━━━━━━━━
📦 INHALTE
500 Videos & Bilder
━━━━━━━━━━━━━━━━━━

✨ Tägliche Updates  
🔥 Standard & Premium Inhalte  
⭐ OnlyFans Zugang  
🎥 HD / 4K Videos  
⚡ Standard Support  

Perfekt für Einsteiger.
`
  },
  PRO: {
    name: "Pro VIP",
    stars: 2500,
    info: `
⭐⭐ PRO VIP – 50 €

━━━━━━━━━━━━━━━━━━
📦 INHALTE
1.500 Videos & Bilder
━━━━━━━━━━━━━━━━━━

✨ Tägliche Updates  
🔥 Premium & exklusive Inhalte  
⭐ OnlyFans & Influencer Zugang  
📲 Social Media Leaks  
⬇️ Download-Funktion  
🎥 4K Videos  
⚡ Priority Support  

🔥 AM BELIEBTESTEN
`
  },
  ULTRA: {
    name: "Ultra VIP",
    stars: 5000,
    info: `
⭐⭐⭐ ULTRA VIP – 100 €

━━━━━━━━━━━━━━━━━━
📦 INHALTE
5.000 Videos & Bilder
━━━━━━━━━━━━━━━━━━

✨ Tägliche Updates  
🔓 Vollzugriff auf Inhalte  
⬇️ Download-Funktion  
🚫 Keine Wasserzeichen  
⭐ OnlyFans & Influencer Zugang  
📲 Social Media Leaks  
💬 Live-Chat Zugriff  
🎥 4K Videos  
⚡ Priority Support  

💎 MAXIMAL
`
  }
};

/* =========================
   START
========================= */
bot.start((ctx) => {
  ctx.reply(
    "🔥 BRAVE VIP 🔥\n\nWähle dein Paket:",
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐ Basic – 25 €", "PRICE_BASIC")],
      [Markup.button.callback("⭐⭐ Pro – 50 €", "PRICE_PRO")],
      [Markup.button.callback("⭐⭐⭐ Ultra – 100 €", "PRICE_ULTRA")]
    ])
  );
});

/* =========================
   INFO
========================= */
bot.action(/PRICE_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const pkg = PACKAGES[key];
  if (!pkg) return;

  await ctx.answerCbQuery();

  return ctx.reply(
    pkg.info,
    Markup.inlineKeyboard([
      [Markup.button.callback("🛒 JETZT KAUFEN ⭐", `BUY_${key}`)],
      [Markup.button.callback("⬅️ Zurück", "BACK")]
    ])
  );
});

/* =========================
   INVOICE
========================= */
bot.action(/BUY_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const pkg = PACKAGES[key];
  if (!pkg) return;

  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");

  return ctx.replyWithInvoice({
    title: pkg.name,
    description: `BRAVE VIP – ${pkg.name}`,
    payload: `${key}_${ctx.from.id}`,
    provider_token: "", // BOTFATHER TOKEN
    currency: "XTR",
    prices: [{ label: pkg.name, amount: pkg.stars }]
  });
});

/* =========================
   ZURÜCK
========================= */
bot.action("BACK", (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    "Wähle dein Paket:",
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐ Basic – 25 €", "PRICE_BASIC")],
      [Markup.button.callback("⭐⭐ Pro – 50 €", "PRICE_PRO")],
      [Markup.button.callback("⭐⭐⭐ Ultra – 100 €", "PRICE_ULTRA")]
    ])
  );
});

/* =========================
   PAYMENT
========================= */
bot.on("pre_checkout_query", (ctx) =>
  ctx.answerPreCheckoutQuery(true)
);

bot.on("successful_payment", (ctx) => {
  ctx.reply("✅ Zahlung erfolgreich! Willkommen bei 🔥 BRAVE VIP 🔥");
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("BOT GESTARTET");
