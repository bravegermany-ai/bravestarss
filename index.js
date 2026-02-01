import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   BUTTONS
========================= */
const MAIN_MENU_BUTTON = Markup.button.callback("🏠 Hauptmenü", "MAIN_MENU");

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
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "STAR_7500")],
      [Markup.button.callback("💳 Weitere Zahlungsmöglichkeiten (Euro)", "OTHER_PAYMENTS")]
    ])
  );
};

bot.start((ctx) => showMainMenu(ctx));
bot.action("MAIN_MENU", async (ctx) => {
  await ctx.answerCbQuery();
  await showMainMenu(ctx, "🏠 Hauptmenü");
});

/* =========================
   STAR PAYMENTS
========================= */
const STAR_PRICES = {
  STAR_1500: 1500,
  STAR_2500: 2500,
  STAR_5000: 5000,
  STAR_7500: 7500,
};

bot.action(/STAR_\d+/, async (ctx) => {
  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");
  const key = ctx.match?.[0];
  if (!key || !STAR_PRICES[key]) return await ctx.reply("❌ Ungültiger Plan!");
  const stars = STAR_PRICES[key];

  // Payment token leer, nur Demo
  await ctx.replyWithInvoice({
    title: `BLAMAGE – ${stars} Stars`,
    description: `Zugang mit ${stars} Telegram-Sternen`,
    payload: `BLAMAGE_${stars}_${ctx.from.id}`,
    provider_token: "", // BOTFATHER TOKEN hier einfügen
    currency: "XTR",
    prices: [{ label: `${stars} Stars`, amount: stars }]
  });
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

bot.on("successful_payment", async (ctx) => {
  await ctx.reply(
    `✅ Zahlung erfolgreich!\n\n🎉 Dein Zugang:\nhttps://t.me/+_Lwkx_EKnd9lMjJh`
  );
});

/* =========================
   EURO PLÄNE
========================= */
bot.action("OTHER_PAYMENTS", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    "💳 Euro-Zahlung – wähle deinen Plan:",
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 25 €", "EU_VIP")],
      [Markup.button.callback("⭐️ Ultra – 50 €", "EU_ULTRA")],
      [Markup.button.callback("⭐️ Ultra Pro – 100 €", "EU_ULTRAPRO")],
      [Markup.button.callback("🔞 Ultimate – 150 €", "EU_ULTIMATE")],
      [MAIN_MENU_BUTTON]
    ])
  );
});

/* =========================
   EURO → METHODEN
========================= */
["EU_VIP","EU_ULTRA","EU_ULTRAPRO","EU_ULTIMATE"].forEach(plan => {
  bot.action(plan, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      `${plan.replace("EU_","")} – Zahlung\n\nWähle Methode:`,
      Markup.inlineKeyboard([
        [Markup.button.callback("🎁 Amazon", `AMAZON_${plan}`)],
        [Markup.button.callback("💰 Paysafecard", `PSC_${plan}`)],
        [MAIN_MENU_BUTTON]
      ])
    );
  });
});

/* =========================
   AMAZON
========================= */
const AMAZON = {
  EU_VIP: 25,
  EU_ULTRA: 50,
  EU_ULTRAPRO: 100,
  EU_ULTIMATE: 150,
};

Object.entries(AMAZON).forEach(([plan, price]) => {
  bot.action(`AMAZON_${plan}`, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      `🎁 *Amazon Zahlung*\n\nSende bitte einen Amazon-Gutschein im Wert von *${price} €* an @BlamageGermany`,
      {
        parse_mode: "Markdown",
        reply_markup: Markup.inlineKeyboard([[MAIN_MENU_BUTTON]])
      }
    );
  });
});

/* =========================
   PAYSAFECARD
========================= */
const PSC = {
  EU_VIP: 25,
  EU_ULTRA: 50,
  EU_ULTRAPRO: 100,
  EU_ULTIMATE: 150,
};

Object.entries(PSC).forEach(([plan, price]) => {
  bot.action(`PSC_${plan}`, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      `💰 *Paysafecard Zahlung*\n\nSende bitte eine Paysafecard im Wert von *${price} €* an @BlamageGermany`,
      {
        parse_mode: "Markdown",
        reply_markup: Markup.inlineKeyboard([[MAIN_MENU_BUTTON]])
      }
    );
  });
});

/* =========================
   START BOT
========================= */
bot.launch({ dropPendingUpdates: true });
console.log("🤖 BOT GESTARTET");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

/* =========================
   ERROR HANDLER
========================= */
bot.catch((err, ctx) => {
  console.error(`Fehler bei UpdateType ${ctx.updateType}:`, err);
});
