import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN fehlt");
  process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   START
========================= */
bot.start((ctx) => {
  const username = ctx.from.first_name || "User";
  ctx.reply(
    `👋 Willkommen bei BRAVE, ${username}!\n\nWähle deinen Plan:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "STAR_1500")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "STAR_2500")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "STAR_5000")],
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "STAR_7500")],
      [Markup.button.callback("💳 Weitere Zahlungsmöglichkeiten", "OTHER_PAYMENTS")]
    ])
  );
});

/* =========================
   STARS (DEAKTIVIERT – SICHER)
========================= */
bot.action(/STAR_\d+/, async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    "⭐️ Stars-Zahlung ist aktuell deaktiviert.\n\nBitte nutze die Euro-Zahlung 💳"
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
      [Markup.button.callback("⭐️ VIP – 25 €", "EU_VIP")],
      [Markup.button.callback("⭐️ Ultra – 50 €", "EU_ULTRA")],
      [Markup.button.callback("⭐️ Ultra Pro – 100 €", "EU_ULTRAPRO")],
      [Markup.button.callback("🔞 Ultimate – 150 €", "EU_ULTIMATE")],
      [Markup.button.callback("⬅️ Zurück", "BACK_TO_START")]
    ])
  );
});

/* =========================
   EURO → ZAHLUNG
========================= */
const euroOptions = (price, back) =>
  Markup.inlineKeyboard([
    [Markup.button.callback("🎁 Amazon", `AMAZON_${price}`)],
    [Markup.button.callback("💰 Paysafecard", `PSC_${price}`)],
    [Markup.button.callback("⬅️ Zurück", back)]
  ]);

bot.action("EU_VIP", (ctx) =>
  ctx.reply(
    "⭐️ VIP – 25 €\nWähle die Zahlungsmethode:",
    euroOptions("25", "OTHER_PAYMENTS")
  )
);

bot.action("EU_ULTRA", (ctx) =>
  ctx.reply(
    "⭐️ Ultra – 50 €\nWähle die Zahlungsmethode:",
    euroOptions("50", "OTHER_PAYMENTS")
  )
);

bot.action("EU_ULTRAPRO", (ctx) =>
  ctx.reply(
    "⭐️ Ultra Pro – 100 €\nWähle die Zahlungsmethode:",
    euroOptions("100", "OTHER_PAYMENTS")
  )
);

bot.action("EU_ULTIMATE", (ctx) =>
  ctx.reply(
    "🔞 Ultimate – 150 €\nWähle die Zahlungsmethode:",
    euroOptions("150", "OTHER_PAYMENTS")
  )
);

/* =========================
   AMAZON / PAYSAFECARD
========================= */
["25", "50", "100", "150"].forEach((amount) => {
  bot.action(`AMAZON_${amount}`, (ctx) =>
    ctx.reply(
      `🎁 Bitte sende einen Amazon-Gutschein im Wert von ${amount} € an @BraveSupport1`
    )
  );

  bot.action(`PSC_${amount}`, (ctx) =>
    ctx.reply(
      `💰 Bitte sende eine Paysafecard im Wert von ${amount} € an @BraveSupport1`
    )
  );
});

/* =========================
   BACK
========================= */
bot.action("BACK_TO_START", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.telegram.sendMessage(
    ctx.chat.id,
    "⬅️ Zurück zum Hauptmenü:",
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "STAR_1500")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "STAR_2500")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "STAR_5000")],
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "STAR_7500")],
      [Markup.button.callback("💳 Weitere Zahlungsmöglichkeiten", "OTHER_PAYMENTS")]
    ])
  );
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("🤖 BOT GESTARTET");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
