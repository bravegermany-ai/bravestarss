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
    euro: "≈ 5,39 €",
    info: `
BRONZE VIP
250 Stars (≈ 5,39 €)

- Tägliche Updates
- Standard Inhalte
- Community Zugriff
- OnlyFans Zugang
- HD Video Qualität
- Standard Support

Geeignet als Einstiegspaket.
`
  },
  SILBER: {
    name: "Silber VIP",
    stars: 500,
    euro: "≈ 10,79 €",
    info: `
SILBER VIP
500 Stars (≈ 10,79 €)

- Tägliche Updates
- Erweiterte Inhalte
- Community Zugriff
- OnlyFans Zugang
- Influencer Inhalte
- HD Video Qualität
- Standard Support

Mehr Inhalte, mehr Auswahl.
`
  },
  GOLD: {
    name: "Gold VIP",
    stars: 1000,
    euro: "≈ 21,99 €",
    info: `
GOLD VIP
1.000 Stars (≈ 21,99 €)

- Tägliche Updates
- Premium Inhalte
- Community Zugriff
- OnlyFans Zugang
- Influencer Zugang
- Social Media Leaks
- 4K Video Qualität
- Priority Support

Bestes Preis-Leistungs-Verhältnis.
`
  },
  PLATIN: {
    name: "Platin VIP",
    stars: 2500,
    euro: "≈ 53,99 €",
    info: `
PLATIN VIP
2.500 Stars (≈ 53,99 €)

- Tägliche Updates
- Premium und exklusive Inhalte
- Community Zugriff
- OnlyFans und Influencer Zugang
- Social Media Leaks
- Download-Funktion
- Keine Wasserzeichen
- 4K Video Qualität
- Priority Support

Für Nutzer mit höheren Ansprüchen.
`
  },
  DIAMOND: {
    name: "Diamond VIP",
    stars: 5000,
    euro: "≈ 109 €",
    info: `
DIAMOND VIP
5.000 Stars (≈ 109 €)

- Tägliche Updates
- Inhalte mit hohem Gegenwert
- Community Zugriff
- Download-Funktion
- Keine Wasserzeichen
- OnlyFans und Influencer Zugang
- Social Media Leaks
- Live-Chat Zugriff
- Votings und Mitbestimmung
- 4K Video Qualität
- Priority Support

Fast vollständiger Zugriff.
`
  },
  ELITE: {
    name: "Elite VIP",
    stars: 10000,
    euro: "≈ 219 €",
    info: `
ELITE VIP
10.000 Stars (≈ 219 €)

- Tägliche Updates
- Vollzugriff auf alle Inhalte
- Community Zugriff
- Download-Funktion
- Keine Wasserzeichen
- OnlyFans und Influencer Zugang
- Social Media und Snapchat Leaks
- Private Telegram Gruppe
- Live-Chat Zugriff
- Votings und Mitbestimmung
- Gewinnspiele und Verlosungen
- 8K Video Qualität
- 24/7 High-End Support

Das umfangreichste Paket.
`
  }
};

/* =========================
   START – PREIS BUTTONS
========================= */
bot.start((ctx) => {
  ctx.reply(
    "BRAVE VIP\n\nWähle dein Paket:",
    Markup.inlineKeyboard([
      [Markup.button.callback("Bronze – 250 Stars (≈ 5,39 €) ★", "PRICE_BRONZE")],
      [Markup.button.callback("Silber – 500 Stars (≈ 10,79 €) ★", "PRICE_SILBER")],
      [Markup.button.callback("Gold – 1.000 Stars (≈ 21,99 €) ★", "PRICE_GOLD")],
      [Markup.button.callback("Platin – 2.500 Stars (≈ 53,99 €) ★", "PRICE_PLATIN")],
      [Markup.button.callback("Diamond – 5.000 Stars (≈ 109 €) ★", "PRICE_DIAMOND")],
      [Markup.button.callback("Elite – 10.000 Stars (≈ 219 €) ★", "PRICE_ELITE")]
    ])
  );
});

/* =========================
   MEHR INFO
========================= */
bot.action(/PRICE_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const pkg = PACKAGES[key];

  await ctx.answerCbQuery();

  return ctx.reply(
    pkg.info,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `Jetzt kaufen – ${pkg.stars} Stars (${pkg.euro}) ★`,
          `BUY_${key}`
        )
      ],
      [Markup.button.callback("Zurück ★", "BACK")]
    ])
  );
});

/* =========================
   INVOICE
========================= */
bot.action(/BUY_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const pkg = PACKAGES[key];

  await ctx.answerCbQuery("Zahlung wird vorbereitet");

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
    "Wähle dein Paket:",
    Markup.inlineKeyboard([
      [Markup.button.callback("Bronze – 250 Stars (≈ 5,39 €) ★", "PRICE_BRONZE")],
      [Markup.button.callback("Silber – 500 Stars (≈ 10,79 €) ★", "PRICE_SILBER")],
      [Markup.button.callback("Gold – 1.000 Stars (≈ 21,99 €) ★", "PRICE_GOLD")],
      [Markup.button.callback("Platin – 2.500 Stars (≈ 53,99 €) ★", "PRICE_PLATIN")],
      [Markup.button.callback("Diamond – 5.000 Stars (≈ 109 €) ★", "PRICE_DIAMOND")],
      [Markup.button.callback("Elite – 10.000 Stars (≈ 219 €) ★", "PRICE_ELITE")]
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
  ctx.reply(`Zahlung erfolgreich.\n${stars} Stars wurden gutgeschrieben.`);
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("BOT GESTARTET");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
