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
      [Markup.button.callback("💳 Euro – 25 €", "EU_25")],
      [Markup.button.callback("🎁 Gratis Zugriff", "FREE_ACCESS")]
    ])
  );
};

bot.start((ctx) => showMainMenu(ctx));
bot.action("MAIN_MENU", async (ctx) => {
  await ctx.answerCbQuery();
  await showMainMenu(ctx, "🏠 Hauptmenü");
});

/* =========================
   STAR PAYMENT (1500)
========================= */
bot.action("STAR_1500", async (ctx) => {
  await ctx.answerCbQuery("💳 Zahlung wird vorbereitet...");

  await ctx.replyWithInvoice({
    title: "BLAMAGE – 1.500 Stars",
    description: "Zugang mit 1.500 Telegram-Sternen",
    payload: `BLAMAGE_1500_${ctx.from.id}`,
    provider_token: "", // BOTFATHER TOKEN
    currency: "XTR",
    prices: [{ label: "1.500 Stars", amount: 1500 }]
  });
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

/* =========================
   SUCCESSFUL PAYMENT (WIE DAVOR)
========================= */
bot.on("successful_payment", async (ctx) => {
  await ctx.reply(
    "⚠️ Beim Bot ist ein Fehler aufgetreten. Bitte melde dich bei @SkandalGermany6."
  );
});

/* =========================
   EURO 25 €
========================= */
bot.action("EU_25", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    "💳 Euro-Zahlung – 25 €\n\nWähle Methode:",
    Markup.inlineKeyboard([
      [Markup.button.callback("🎁 Amazon", "AMAZON_25")],
      [Markup.button.callback("💰 Paysafecard", "PSC_25")],
      [MAIN_MENU_BUTTON]
    ])
  );
});

bot.action("AMAZON_25", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    "🎁 *Amazon Zahlung*\n\nSende bitte einen Amazon-Gutschein im Wert von *25 €* an @SkandalGermany6",
    {
      parse_mode: "Markdown",
      reply_markup: Markup.inlineKeyboard([[MAIN_MENU_BUTTON]])
    }
  );
});

bot.action("PSC_25", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    "💰 *Paysafecard Zahlung*\n\nSende bitte eine Paysafecard im Wert von *25 €* an @SkandalGermany6",
    {
      parse_mode: "Markdown",
      reply_markup: Markup.inlineKeyboard([[MAIN_MENU_BUTTON]])
    }
  );
});

/* =========================
   GRATIS ZUGRIFF MIT BUTTON UNTEN
========================= */
bot.action("FREE_ACCESS", async (ctx) => {
  await ctx.answerCbQuery();

  const shareUrl = "https://t.me/share/url?url=" + encodeURIComponent(
    "INFLUENCER L E A K S 🔞🇩🇪😱\nhttps://t.me/+Ngf7Kd3U5QQ5Mjkx"
  );

  await ctx.reply(
    "🎁 *Gratis Zugriff*\n\n" +
    "So bekommst du kostenlosen Zugang:\n\n" +
    "1️⃣ Teile die Gruppe mit *mindestens 5 Freunden*\n" +
    "2️⃣ Mache Screenshots / Weiterleitungs-Beweise\n" +
    "3️⃣ Sende die Beweise an 👉 @SkandalGermany6\n\n" +
    "⏳ Nach Prüfung wirst du manuell freigeschaltet.",
    {
      parse_mode: "Markdown",
      reply_markup: Markup.inlineKeyboard([
        [Markup.button.url("📤 Gruppe teilen", shareUrl)],
        [MAIN_MENU_BUTTON]
      ])
    }
  );
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
