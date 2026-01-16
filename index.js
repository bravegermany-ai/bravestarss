import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

/* /start */
bot.start((ctx) => {
  const userName = ctx.from.first_name || "User";

  ctx.reply(
    `👋 Willkommen bei BRAVE, ${userName}!`,
    Markup.inlineKeyboard([
      [Markup.button.callback("⭐ VIP – 1.250 Stars", "VIP_1250")],
      [Markup.button.callback("⭐ Ultra – 2.500 Stars", "ULTRA_2500")],
      [Markup.button.callback("⭐ Ultra Pro – 5.000 Stars", "ULTRAPRO_5000")]
    ])
  );
});

/* VIP */
bot.action("VIP_1250", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithInvoice({
    title: "⭐ VIP Paket",
    description: "VIP Zugang bei BRAVE",
    payload: "vip_1250",
    provider_token: "",
    currency: "XTR",
    prices: [{ label: "VIP – 1.250 Stars", amount: 1250 }]
  });
});

/* ULTRA */
bot.action("ULTRA_2500", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithInvoice({
    title: "⭐ Ultra Paket",
    description: "Ultra Zugang bei BRAVE",
    payload: "ultra_2500",
    provider_token: "",
    currency: "XTR",
    prices: [{ label: "Ultra – 2.500 Stars", amount: 2500 }]
  });
});

/* ULTRA PRO */
bot.action("ULTRAPRO_5000", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithInvoice({
    title: "⭐ Ultra Pro Paket",
    description: "Ultra Pro Zugang bei BRAVE",
    payload: "ultrapro_5000",
    provider_token: "",
    currency: "XTR",
    prices: [{ label: "Ultra Pro – 5.000 Stars", amount: 5000 }]
  });
});

/* Checkout bestätigen */
bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

/* Zahlung erfolgreich */
bot.on("successful_payment", (ctx) => {
  ctx.reply("✅ Zahlung erfolgreich! Willkommen bei BRAVE 🚀");
});

bot.launch({ dropPendingUpdates: true });
