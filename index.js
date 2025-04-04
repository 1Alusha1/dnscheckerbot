import { Telegraf, Scenes, session, Markup } from "telegraf";
import { config } from "dotenv";
config();
import db from "./db.js";
import addDomain from "./scenes/addDomain.js";
import checkDomainStatus from "./scenes/checkDomainStatus.js";

const stage = new Scenes.Stage([addDomain(), checkDomainStatus()]);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());
bot.use(stage.middleware());

db().catch((err) => console.log(err));

bot.start(async (ctx) => {
  await ctx.reply(
    "Привет, ниже доступные команды",
    Markup.keyboard([["🆕 Добавить домен", "📊 Проверить статус доменов"]])
      .oneTime()
      .resize()
  );
});

bot.hears("🆕 Добавить домен", async (ctx) => {
  await ctx.scene.enter("addDomain");
});

bot.hears("📊 Проверить статус доменов", async (ctx) => {
  await ctx.scene.enter("checkDomainStatus");
});

bot.on("text", (ctx) => {
  ctx.reply("Используй кнопки");
});

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
