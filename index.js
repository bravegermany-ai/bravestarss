import { Telegraf, Markup } from "telegraf";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN fehlt");

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   ADMIN CHAT
========================= */
const ADMIN_CHAT_ID = "@BraveSupport1";

/* =========================
   HAUPTMENÜ BUTTON
========================= */
const MAIN_MENU_BUTTON = Markup.button.callback("🏠 Hauptmenü", "MAIN_MENU");

/* =========================
   START & HAUPTMENÜ
========================= */
const MENU_BUTTONS = [
  [Markup.button.callback("⭐️ VIP", "BACK_TO_START")],
  [Markup.button.callback("👻 Snapchat Tool", "SNAPCHAT_TOOL")]
];

bot.start((ctx) => {
  const username = ctx.from.first_name || "User";
  ctx.reply(
    `👋 Willkommen bei BRAVE, ${username}!\n\nWähle eine Option:`,
    Markup.inlineKeyboard(MENU_BUTTONS)
  );
});

bot.action("MAIN_MENU", async (ctx) => {
  await ctx.answerCbQuery();
  const username = ctx.from.first_name || "User";
  ctx.reply(
    `👋 Willkommen zurück im Hauptmenü, ${username}!\n\nWähle eine Option:`,
    Markup.inlineKeyboard(MENU_BUTTONS)
  );
});

/* =========================
   STAR PAYMENT (VIP)
========================= */
const STAR_PRICES = {
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
  const payment = ctx.message.successful_payment;
  const user = ctx.from;
  const stars = payment.total_amount;

  await ctx.reply(
    `✅ Zahlung erfolgreich!\n\nHier ist dein Zugang: [Klicke hier](https://t.me/+_Lwkx_EKnd9lMjJh)`,
    { parse_mode: "Markdown" }
  );

  await ctx.telegram.sendMessage(
    ADMIN_CHAT_ID,
    `⭐️ *Neue Stars-Zahlung!*\n\n👤 ${user.first_name} (@${user.username || "kein_username"})\n🆔 ID: ${user.id}\n💫 Stars: ${stars}`,
    { parse_mode: "Markdown" }
  );
});

/* =========================
   EURO STUFEN (VIP)
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
      [MAIN_MENU_BUTTON]
    ])
  );
});

const paypalButton = Markup.button.url(
  "💳 PayPal",
  "https://www.paypal.me/BraveSupport2"
);

["EU_VIP","EU_ULTRA","EU_ULTRAPRO","EU_ULTIMATE"].forEach(plan => {
  bot.action(plan, async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply(
      `${plan.replace("EU_","")} – Euro-Zahlung\n📩 Schicke den Code an @BraveSupport1 für den Kauf.`,
      Markup.inlineKeyboard([
        [paypalButton],
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
const AMAZON_MESSAGES = {
  EU_VIP: 25,
  EU_ULTRA: 50,
  EU_ULTRAPRO: 100,
  EU_ULTIMATE: 150,
};

Object.entries(AMAZON_MESSAGES).forEach(([key, value]) => {
  bot.action(`AMAZON_${key}`, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.telegram.sendMessage(
      ADMIN_CHAT_ID,
      `🎁 *Amazon Zahlung ausgewählt*\n\n👤 ${ctx.from.first_name} (@${ctx.from.username || "kein_username"})\n🆔 ID: ${ctx.from.id}\n💶 Betrag: ${value} €`,
      { parse_mode: "Markdown" }
    );
    ctx.reply(
      `🎁 Bitte sende einen Amazon-Gutschein im Wert von ${value} € an @BraveSupport1`,
      Markup.inlineKeyboard([[MAIN_MENU_BUTTON]])
    );
  });
});

/* =========================
   PAYSAFECARD
========================= */
const PSC_MESSAGES = {
  EU_VIP: 25,
  EU_ULTRA: 50,
  EU_ULTRAPRO: 100,
  EU_ULTIMATE: 150,
};

Object.entries(PSC_MESSAGES).forEach(([key, value]) => {
  bot.action(`PSC_${key}`, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.telegram.sendMessage(
      ADMIN_CHAT_ID,
      `💰 *Paysafecard Zahlung ausgewählt*\n\n👤 ${ctx.from.first_name} (@${ctx.from.username || "kein_username"})\n🆔 ID: ${ctx.from.id}\n💶 Betrag: ${value} €`,
      { parse_mode: "Markdown" }
    );
    ctx.reply(
      `💰 Bitte sende eine Paysafecard im Wert von ${value} € an @BraveSupport1`,
      Markup.inlineKeyboard([[MAIN_MENU_BUTTON]])
    );
  });
});

/* =========================
   SNAPCHAT TOOL
========================= */
bot.action("SNAPCHAT_TOOL", async (ctx) => {
  await ctx.answerCbQuery();

  // Proof & Status
  await ctx.reply(
    "🔥 *Snapchat Tool* 🔥\nStatus: Working ✅",
    { parse_mode: "Markdown" }
  );

  // Buttons: Proof + Preise + Hauptmenü
  await ctx.reply(
    "Mehr Infos:",
    Markup.inlineKeyboard([
      [Markup.button.url("📹 Beweis ansehen", "https://t.me/+8TRtfKKWhu81ODcx")],
      [Markup.button.callback("💶 25 €", "SNAP_25")],
      [Markup.button.callback("💶 50 €", "SNAP_50")],
      [Markup.button.callback("⚡ Direkt Tool – 120 €", "SNAP_120")],
      [MAIN_MENU_BUTTON]
    ])
  );

  // Sternen-Zahlungen (Snap Tool)
  const SNAP_STAR_PRICES = {
    STAR_1500: 1500,
    STAR_2500: 2500,
    STAR_5000: 5000
  };
  Object.entries(SNAP_STAR_PRICES).forEach(([key, stars]) => {
    bot.action(key, async (ctx) => {
      await ctx.answerCbQuery();
      ctx.reply(
        `💳 Du hast Snapchat Tool für ${stars} Stars gewählt.\n📩 Schicke den Code an @BraveSupport1.`
      );
      await ctx.telegram.sendMessage(
        ADMIN_CHAT_ID,
        `👻 *Snapchat Tool (Stars) gewählt*\n\n👤 ${ctx.from.first_name} (@${ctx.from.username || "kein_username"})\n🆔 ID: ${ctx.from.id}\n💫 Stars: ${stars}`,
        { parse_mode: "Markdown" }
      );
    });
  });

  // Normale Zahlungen (Snap Tool)
  const SNAP_PRICES = {
    SNAP_25: 25,
    SNAP_50: 50,
    SNAP_120: 120
  };
  Object.entries(SNAP_PRICES).forEach(([key, amount]) => {
    bot.action(key, async (ctx) => {
      await ctx.answerCbQuery();
      ctx.reply(
        `💳 Du hast Snapchat Tool für ${amount} € gewählt.\n📩 Schicke den Code an @BraveSupport1.`,
        Markup.inlineKeyboard([[MAIN_MENU_BUTTON]])
      );
      await ctx.telegram.sendMessage(
        ADMIN_CHAT_ID,
        `👻 *Snapchat Tool gewählt*\n\n👤 ${ctx.from.first_name} (@${ctx.from.username || "kein_username"})\n🆔 ID: ${ctx.from.id}\n💶 Betrag: ${amount} €`,
        { parse_mode: "Markdown" }
      );
    });
  });
});

/* =========================
   BACK TO START
========================= */
bot.action("BACK_TO_START", async (ctx) => {
  await ctx.answerCbQuery();
  const username = ctx.from.first_name || "User";
  ctx.reply(
    `👋 Willkommen zurück bei BRAVE, ${username}!\n\nWähle deinen Plan:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐️ VIP – 1.500 Stars", "STAR_1500")],
      [Markup.button.callback("⭐️ Ultra – 2.500 Stars", "STAR_2500")],
      [Markup.button.callback("⭐️ Ultra Pro – 5.000 Stars", "STAR_5000")],
      [Markup.button.callback("🔞 Ultimate – 7.500 Stars", "STAR_7500")],
      [Markup.button.callback("💳 Weitere Zahlungsmöglichkeiten", "OTHER_PAYMENTS")],
      [Markup.button.callback("👻 Snapchat Tool", "SNAPCHAT_TOOL")]
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
