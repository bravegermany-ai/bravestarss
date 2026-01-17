import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN fehlt");
}

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   KONFIG
========================= */
const VIP_GROUP_LINK = "https://t.me/+_Lwkx_EKnd9lMjJh";

/* =========================
   PAKETE
========================= */
const PACKAGES = {
  GOLD: {
    name: "Gold VIP",
    stars: 1000,
    info: `
🥇 GOLD VIP – 25 €

━━━━━━━━━━━━━━━━━━
📦 INHALTE
500 Videos & Bilder
━━━━━━━━━━━━━━━━━━

✨ Tägliche Updates  
🔥 Premium Inhalte  
⭐ OnlyFans Zugang  
👥 Influencer Inhalte  
📲 Social Media Leaks  
🎥 4K Video Qualität  
⚡ Priority Support
`
  },
  PLATIN: {
    name: "Platin VIP",
    stars: 2500,
    info: `
💠 PLATIN VIP – 50 €

━━━━━━━━━━━━━━━━━━
📦 INHALTE
1.500 Videos & Bilder
━━━━━━━━━━━━━━━━━━

✨ Tägliche Updates  
💎 Exklusive Premium Inhalte  
⭐ OnlyFans & Influencer Zugang  
📲 Social Media Leaks  
⬇️ Download-Funktion  
🚫 Keine Wasserzeichen  
🎥 4K Video Qualität  
⚡ Priority Support
`
  },
  DIAMOND: {
    name: "Diamond VIP",
    stars: 5000,
    info: `
💎 DIAMOND VIP – 100 €

━━━━━━━━━━━━━━━━━━
📦 INHALTE
5.000 Videos & Bilder
━━━━━━━━━━━━━━━━━━

✨ Tägliche Updates  
🔓 Vollzugriff auf Inhalte  
⭐ OnlyFans & Influencer Zugang  
📲 Social Media Leaks  
⬇️ Download-Funktion  
🚫 Keine Wasserzeichen  
💬 Live-Chat Zugriff  
🎥 4K Video Qualität  
⚡ Priority Support
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
      [Markup.button.callback("🥇 Gold – 25 € ⭐️", "PRICE_GOLD")],
      [Markup.button.callback("💠 Platin – 50 € ⭐️", "PRICE_PLATIN")],
      [Markup.button.callback("💎 Diamond – 100 € ⭐️", "PRICE_DIAMOND")]
    ])
  );
});

/* =========================
   PAKET INFO
========================= */
bot.action(/PRICE_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const pkg = PACKAGES[key];
  if (!pkg) return;

  await ctx.answerCbQuery();

  return ctx.reply(
    pkg.info,
    Markup.inlineKeyboard([
      [Markup.button.callback("🛒 JETZT KAUFEN ⭐️", `BUY_${key}`)],
      [Markup.button.callback("⬅️ Zurück ⭐️", "BACK")]
    ])
  );
});

/* =========================
   ZAHLUNG
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
    provider_token: "", // BOTFATHER PAYMENT TOKEN
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
      [Markup.button.callback("🥇 Gold – 25 € ⭐️", "PRICE_GOLD")],
      [Markup.button.callback("💠 Platin – 50 € ⭐️", "PRICE_PLATIN")],
      [Markup.button.callback("💎 Diamond – 100 € ⭐️", "PRICE_DIAMOND")]
    ])
  );
});

/* =========================
   PAYMENT EVENTS
========================= */
bot.on("pre_checkout_query", (ctx) =>
  ctx.answerPreCheckoutQuery(true)
);

bot.on("successful_payment", async (ctx) => {
  await ctx.reply(
    "✅ Zahlung erfolgreich!\n\n👉 Klicke unten, um eine Beitrittsanfrage zur VIP-Gruppe zu senden:",
    Markup.inlineKeyboard([
      [
        Markup.button.url(
          "⭐️ ZUR VIP-GRUPPE ⭐️",
          VIP_GROUP_LINK
        )
      ]
    ])
  );
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("BOT GESTARTET");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
