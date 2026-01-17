import { Telegraf, Markup } from "telegraf";

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

const bot = new Telegraf(process.env.BOT_TOKEN);

// HIER EINE ECHTE file_id EINTRAGEN
const PREVIEW_IMAGE = "AGACAgQAAxkBAAIB...";

// PAKETE
const PACKAGES = {
  STARTER: {
    name: "STARTER",
    stars: 250,
    euro: "25 €",
    info: `STARTER

Tägliche Updates
Standard Inhalte
Community Forum
OnlyFans Zugang
HD Video Qualität
Standard Support`
  },
  ULTRA: {
    name: "ULTRA",
    stars: 500,
    euro: "50 €",
    info: `ULTRA

Tägliche Updates
Premium Inhalte
Community Forum
OnlyFans Zugang
Influencer Zugang
Social Media Leaks
4K Video Qualität
Priority Support`
  },
  ULTRAPRO: {
    name: "ULTRA PRO",
    stars: 1000,
    euro: "100 €",
    info: `ULTRA PRO (Lifetime)

Tägliche Updates
Inhalte im Wert von 5000 €
Download-Funktion
Keine Wasserzeichen
OnlyFans Zugang
Influencer Zugang
Live Chat Zugang
4K Video Qualität
Priority Support`
  },
  ULTIMATE: {
    name: "ULTIMATE",
    stars: 1500,
    euro: "150 €",
    info: `ULTIMATE (Lifetime)

3/10 Plätze verfügbar
Inhalte im Wert von 10.000 €
Download-Funktion
Keine Wasserzeichen
Private Telegram Gruppe
Live-Chat mit Frauen
Gewinnspiele
8K Video Qualität
24/7 Support`
  }
};

// START
bot.start((ctx) => {
  ctx.reply(
    "BRAVE VIP JETZT ONLINE\nWähle dein Paket:",
    Markup.inlineKeyboard([
      [Markup.button.callback("STARTER – 25 € ⭐", "PRICE_STARTER")],
      [Markup.button.callback("ULTRA – 50 € ⭐", "PRICE_ULTRA")],
      [Markup.button.callback("ULTRA PRO – 100 € ⭐", "PRICE_ULTRAPRO")],
      [Markup.button.callback("ULTIMATE – 150 € ⭐", "PRICE_ULTIMATE")]
    ])
  );
});

// PREIS → INFO
bot.action(/PRICE_(.+)/, async (ctx) => {
  try {
    const key = ctx.match[1];
    const pkg = PACKAGES[key];
    if (!pkg) return;

    await ctx.answerCbQuery();

    if (PREVIEW_IMAGE && !PREVIEW_IMAGE.includes("HIER")) {
      await ctx.replyWithPhoto(PREVIEW_IMAGE);
    }

    await ctx.reply(
      pkg.info,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            `Jetzt kaufen – ${pkg.euro} ⭐`,
            `BUY_${key}`
          )
        ],
        [Markup.button.callback("Zurück ⭐", "BACK")]
      ])
    );
  } catch (e) {
    console.error(e);
    ctx.reply("Fehler – bitte erneut versuchen.");
  }
});

// ZURÜCK
bot.action("BACK", (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    "Wähle dein Paket:",
    Markup.inlineKeyboard([
      [Markup.button.callback("STARTER – 25 € ⭐", "PRICE_STARTER")],
      [Markup.button.callback("ULTRA – 50 € ⭐", "PRICE_ULTRA")],
      [Markup.button.callback("ULTRA PRO – 100 € ⭐", "PRICE_ULTRAPRO")],
      [Markup.button.callback("ULTIMATE – 150 € ⭐", "PRICE_ULTIMATE")]
    ])
  );
});

// KAUF
bot.action(/BUY_(.+)/, (ctx) => {
  const key = ctx.match[1];
  const pkg = PACKAGES[key];

  ctx.answerCbQuery();
  ctx.replyWithInvoice({
    title: `${pkg.name} Paket`,
    description: `${pkg.name} bei BRAVE`,
    payload: key,
    provider_token: process.env.PROVIDER_TOKEN,
    currency: "XTR",
    prices: [{ label: pkg.name, amount: pkg.stars }]
  });
});

// PAYMENT
bot.on("pre_checkout_query", (ctx) =>
  ctx.answerPreCheckoutQuery(true)
);

bot.on("successful_payment", (ctx) => {
  ctx.reply("Zahlung erfolgreich. Willkommen bei BRAVE.");
});

// START BOT
(async () => {
  await bot.telegram.deleteWebhook();
  await bot.launch({ dropPendingUpdates: true });
  console.log("BOT GESTARTET");
})();
