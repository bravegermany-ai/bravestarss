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
🟤 *BRONZE VIP*

🎥 3.000+ Clips
🇩🇪 Deutsche Inhalte
👻 Snapchat-Material
🤫 Erste versteckte Videos
`
  },
  SILBER: {
    name: "Silber VIP",
    stars: 500,
    info: `
⚪ *SILBER VIP*

🎥 5.000+ Clips
🇩🇪 🇹🇷 Deutsche & südländische Inhalte
👻 Snapchat
😳 Erste Live-Aufnahmen
`
  },
  GOLD: {
    name: "Gold VIP",
    stars: 1000,
    info: `
🟡 *GOLD VIP* ⭐ BELIEBT

🎥 7.500+ Clips
⭐ Exklusive OnlyFans-Inhalte
🇩🇪 🇹🇷 Inhalte
😳 Live-Streams
🤫 Seltene Videos
`
  },
  PLATIN: {
    name: "Platin VIP",
    stars: 2500,
    info: `
🔵 *PLATIN VIP*

🎥 10.000+ Clips
⭐ Premium OnlyFans
🎥 OmeTV-Clips
😳 Live-Streams
`
  },
  DIAMOND: {
    name: "Diamond VIP",
    stars: 5000,
    info: `
🟣 *DIAMOND VIP*

🎥 12.000+ Clips
⭐ Alle OnlyFans
😳 Alle Live-Streams
🧕🏻 Hijabi-Content
`
  },
  ELITE: {
    name: "Elite VIP",
    stars: 10000,
    info: `
🔴 *ELITE VIP – ALL IN 👑*

🔥 Vollzugriff auf alles
🎥 12.000+ Clips + Updates
⭐ Alle OnlyFans
😳 Alle Live-Streams
👑 LIFETIME VIP

💰 Gesamtwert über 7.000€
`
  }
};

/* =========================
   START – PREISE
========================= */
bot.start((ctx) => {
  ctx.reply(
    "🔥 *BRAVE VIP JETZT ONLINE* 🚀\n\n⭐ Wähle dein Paket:",
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🟤 Bronze – 250 ⭐", "PRICE_BRONZE")],
        [Markup.button.callback("⚪ Silber – 500 ⭐", "PRICE_SILBER")],
        [Markup.button.callback("🟡 Gold – 1.000 ⭐", "PRICE_GOLD")],
        [Markup.button.callback("🔵 Platin – 2.500 ⭐", "PRICE_PLATIN")],
        [Markup.button.callback("🟣 Diamond – 5.000 ⭐", "PRICE_DIAMOND")],
        [Markup.button.callback("🔴 Elite – 10.000 ⭐", "PRICE_ELITE")]
      ])
    }
  );
});

/* =========================
   MEHR INFO
========================= */
bot.action(/PRICE_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const pkg = PACKAGES[key];

  await ctx.answerCbQuery();

  return ctx.reply(pkg.info, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `🛒 Jetzt kaufen – ${pkg.stars} ⭐`,
          `BUY_${key}`
        )
      ],
      [Markup.button.callback("⬅️ Zurück", "BACK")]
    ])
  });
});

/* =========================
   INVOICE
========================= */
bot.action(/BUY_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const pkg = PACKAGES[key];

  await ctx.answerCbQuery("Zahlung wird vorbereitet…");

  return ctx.replyWithInvoice({
    title: pkg.name,
    description: `BRAVE VIP – ${pkg.name}`,
    payload: `${key}_${ctx.from.id}`,
    provider_token: "", // Telegram Stars
    currency: "XTR",
    prices: [{ label: pkg.name, amount: pkg.stars }]
  });
});

/* =========================
   ZURÜCK
========================= */
bot.action("BACK", (ctx) => {
  ctx.answerCbQuery();
  return ctx.reply(
    "⭐ Wähle dein Paket:",
    Markup.inlineKeyboard([
      [Markup.button.callback("🟤 Bronze – 250 ⭐", "PRICE_BRONZE")],
      [Markup.button.callback("⚪ Silber – 500 ⭐", "PRICE_SILBER")],
      [Markup.button.callback("🟡 Gold – 1.000 ⭐", "PRICE_GOLD")],
      [Markup.button.callback("🔵 Platin – 2.500 ⭐", "PRICE_PLATIN")],
      [Markup.button.callback("🟣 Diamond – 5.000 ⭐", "PRICE_DIAMOND")],
      [Markup.button.callback("🔴 Elite – 10.000 ⭐", "PRICE_ELITE")]
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
  const stars = ctx.message.successful_payment.total_amount;
  ctx.reply(`✅ Zahlung erfolgreich!\n⭐ ${stars} Stars erhalten`);
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("🔥 BOT GESTARTET (Railway)");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
