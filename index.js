import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   START
========================= */
bot.start((ctx) => {
  const username = ctx.from.first_name || "User";
  ctx.reply(
    `👋 Willkommen bei BRAVE, ${username}!\n\nWähle deinen Plan:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("🌟 Starter – 500 Stars", "STAR_500")],
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "STAR_1500")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "STAR_2500")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "STAR_5000")],
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "STAR_7500")],
      [Markup.button.callback("💳 Weitere Zahlungsmöglichkeiten", "OTHER_PAYMENTS")]
    ])
  );
});

/* =========================
   STAR PAYMENT
========================= */
const STAR_PRICES = {
  STAR_500: 500,
  STAR_1500: 1500,
  STAR_2500: 2500,
  STAR_5000: 5000,
  STAR_7500: 7500,
};

bot.action(/STAR_\d+/, async (ctx) => {
  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");
  const stars = STAR_PRICES[ctx.match[0]];

  return ctx.replyWithInvoice({
    title: `BRAVE – ${stars} Stars`,
    description: `Zugang mit ${stars} Telegram-Sternen`,
    payload: `BRAVE_${stars}_${ctx.from.id}`,
    provider_token: "", // BOTFATHER PAYMENT TOKEN
    currency: "XTR",
    prices: [{ label: `${stars} Stars`, amount: stars }]
  });
});

bot.on("pre_checkout_query", (ctx) =>
  ctx.answerPreCheckoutQuery(true)
);

bot.on("successful_payment", async (ctx) => {
  await ctx.reply(
    "✅ Zahlung erfolgreich!\n\nBitte kontaktiere jetzt @BraveSupport1, um deinen Zugang freizuschalten."
  );
});

/* =========================
   EURO STUFEN
========================= */
bot.action("OTHER_PAYMENTS", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "💳 Wähle deinen Plan (Euro-Preise):",
    Markup.inlineKeyboard([
      [Markup.button.callback("🌟 Starter – 10 €", "EU_STARTER")],
      [Markup.button.callback("⭐️ VIP – 25 €", "EU_VIP")],
      [Markup.button.callback("⭐️ Ultra – 50 €", "EU_ULTRA")],
      [Markup.button.callback("⭐️ Ultra Pro – 100 €", "EU_ULTRAPRO")],
      [Markup.button.callback("🔞 Ultimate – 150 €", "EU_ULTIMATE")],
      [Markup.button.callback("⬅️ Zurück", "BACK_TO_START")]
    ])
  );
});

/* =========================
   EURO → ZAHLUNG (OHNE PAYPAL)
========================= */
const euroOptions = (price, back) =>
  Markup.inlineKeyboard([
    [Markup.button.callback("🎁 Amazon", `AMAZON_${price}`)],
    [Markup.button.callback("💰 Paysafecard", `PSC_${price}`)],
    [Markup.button.callback("⬅️ Zurück", back)]
  ]);

bot.action("EU_STARTER", (ctx) =>
  ctx.reply("🌟 Starter – 10 €\nWähle die Zahlungsmethode:", euroOptions("10", "OTHER_PAYMENTS"))
);
bot.action("EU_VIP", (ctx) =>
  ctx.reply("⭐️ VIP – 25 €\nWähle die Zahlungsmethode:", euroOptions("25", "OTHER_PAYMENTS"))
);
bot.action("EU_ULTRA", (ctx) =>
  ctx.reply("⭐️ Ultra – 50 €\nWähle die Zahlungsmethode:", euroOptions("50", "OTHER_PAYMENTS"))
);
bot.action("EU_ULTRAPRO", (ctx) =>
  ctx.reply("⭐️ Ultra Pro – 100 €\nWähle die Zahlungsmethode:", euroOptions("100", "OTHER_PAYMENTS"))
);
bot.action("EU_ULTIMATE", (ctx) =>
  ctx.reply("🔞 Ultimate – 150 €\nWähle die Zahlungsmethode:", euroOptions("150", "OTHER_PAYMENTS"))
);

/* =========================
   AMAZON / PSC HINWEISE
========================= */
["10", "25", "50", "100", "150"].forEach((amount) => {
  bot.action(`AMAZON_${amount}`, (ctx) =>
    ctx.reply(`🎁 Bitte sende einen Amazon-Gutschein im Wert von ${amount} € an @BraveSupport1`)
  );
  bot.action(`PSC_${amount}`, (ctx) =>
    ctx.reply(`💰 Bitte sende eine Paysafecard im Wert von ${amount} € an @BraveSupport1`)
  );
});

/* =========================
   BACK
========================= */
bot.action("BACK_TO_START", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.telegram.sendMessage(ctx.chat.id, "⬅️ Zurück zum Hauptmenü:", Markup.inlineKeyboard([
    [Markup.button.callback("🌟 Starter – 500 Stars", "STAR_500")],
    [Markup.button.callback("⭐️ VIP – 1.500 Stars", "STAR_1500")],
    [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "STAR_2500")],
    [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "STAR_5000")],
    [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "STAR_7500")],
    [Markup.button.callback("💳 Weitere Zahlungsmöglichkeiten", "OTHER_PAYMENTS")]
  ]));
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("🤖 BOT GESTARTET");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
