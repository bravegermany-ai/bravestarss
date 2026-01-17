import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN fehlt");
}

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   PAKETE
========================= */
const PACKAGES = {
  BRONZE: {
    name: "Bronze VIP",
    stars: 250,
    info: `
🥉 BRONZE VIP

✨ Tägliche Updates  
📂 Standard Inhalte  
👥 Community Zugriff  
🔥 OnlyFans Zugang  
🎥 HD Video Qualität  
🛠 Standard Support  

💡 Perfekt für den Einstieg.
`
  },
  SILBER: {
    name: "Silber VIP",
    stars: 500,
    info: `
🥈 SILBER VIP

✨ Tägliche Updates  
📂 Erweiterte Inhalte  
👥 Community Zugriff  
🔥 OnlyFans Zugang  
⭐ Influencer Inhalte  
🎥 HD Video Qualität  
🛠 Standard Support  

🚀 Mehr Auswahl, mehr Inhalte.
`
  },
  GOLD: {
    name: "Gold VIP",
    stars: 1000,
    info: `
🥇 GOLD VIP

✨ Tägliche Updates  
📦 500 Inhalte  
💎 Premium Inhalte  
👥 Community Zugriff  
🔥 OnlyFans Zugang  
⭐ Influencer Zugang  
📲 Social Media Leaks  
🎥 4K Video Qualität  
⚡ Priority Support  

🔥 Bestseller Paket.
`
  },
  PLATIN: {
    name: "Platin VIP",
    stars: 2500,
    info: `
💠 PLATIN VIP

✨ Tägliche Updates  
📦 1.500 Inhalte  
💎 Exklusive Premium Inhalte  
👥 Community Zugriff  
🔥 OnlyFans & Influencer Zugang  
📲 Social Media Leaks  
⬇️ Download-Funktion  
🚫 Keine Wasserzeichen  
🎥 4K Video Qualität  
⚡ Priority Support  

💎 Für echte Genießer.
`
  },
  DIAMOND: {
    name: "Diamond VIP",
    stars: 5000,
    info: `
💎 DIAMOND VIP

✨ Tägliche Updates  
📦 5.000 Inhalte  
👥 Community Zugriff  
⬇️ Download-Funktion  
🚫 Keine Wasserzeichen  
🔥 OnlyFans & Influencer Zugang  
📲 Social Media Leaks  
💬 Live-Chat Zugriff  
🗳 Votings & Mitbestimmung  
🎥 4K Video Qualität  
⚡ Priority Support  

💎 Fast kompletter Zugriff.
`
  },
  ELITE: {
    name: "Elite VIP",
    stars: 10000,
    info: `
👑 ELITE VIP

✨ Tägliche Updates  
📦 12.000 Inhalte  
🔓 Vollzugriff auf alle Inhalte  
👥 Community Zugriff  
⬇️ Download-Funktion  
🚫 Keine Wasserzeichen  
🔥 OnlyFans & Influencer Zugang  
📲 Social Media & Snapchat Leaks  
💬 Private Telegram Gruppe  
🗳 Votings & Mitbestimmung  
🎁 Gewinnspiele & Verlosungen  
🎥 8K Video Qualität  
🛎 24/7 High-End Support  

👑 Das ultimative Paket.
`
  }
};

/* =========================
   START
========================= */
bot.start((ctx) => {
  ctx.reply(
    "🔥 BRAVE VIP 🔥\n\n🚀 Wähle dein Paket:",
    Markup.inlineKeyboard([
      [Markup.button.callback("🥉 Bronze ⭐", "PRICE_BRONZE")],
      [Markup.button.callback("🥈 Silber ⭐", "PRICE_SILBER")],
      [Markup.button.callback("🥇 Gold ⭐", "PRICE_GOLD")],
      [Markup.button.callback("💠 Platin ⭐", "PRICE_PLATIN")],
      [Markup.button.callback("💎 Diamond ⭐", "PRICE_DIAMOND")],
      [Markup.button.callback("👑 Elite ⭐", "PRICE_ELITE")]
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
      [Markup.button.callback("⬅️ Zurück ⭐", "BACK")]
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
    provider_token: "",
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
    "🚀 Wähle dein Paket:",
    Markup.inlineKeyboard([
      [Markup.button.callback("🥉 Bronze ⭐", "PRICE_BRONZE")],
      [Markup.button.callback("🥈 Silber ⭐", "PRICE_SILBER")],
      [Markup.button.callback("🥇 Gold ⭐", "PRICE_GOLD")],
      [Markup.button.callback("💠 Platin ⭐", "PRICE_PLATIN")],
      [Markup.button.callback("💎 Diamond ⭐", "PRICE_DIAMOND")],
      [Markup.button.callback("👑 Elite ⭐", "PRICE_ELITE")]
    ])
  );
});

/* =========================
   PAYMENT EVENTS
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
