import { Telegraf, Scenes, session, Markup } from "telegraf";
import { config } from "dotenv";
config();
import db from "./db.js";
import addDomain from "./scenes/addDomain.js";
import userSchema from "./models/user.js";
import checkDomainStatus from "./scenes/checkDomainStatus.js";
import startScene from "./scenes/startScene.js";
import addLink from "./scenes/addLink.js";

const stage = new Scenes.Stage([
  addDomain(),
  checkDomainStatus(),
  startScene(),
  addLink(),
]);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());
bot.use(stage.middleware());

db().catch((err) => console.log(err));

bot.start(async (ctx) => {
  const userId = ctx.message.from.id;
  const u = await userSchema.findOne({ userId });
  console.log(u)
  if (!u) {
    await ctx.reply(
      "Привет, выберите желаемы тип проверки",
      Markup.keyboard([["RU RU", "Facebook"]]).resize()
    );
  } else {
    if (u.type === "RU RU") {
      return await ctx.reply(
        "Добро пожаловать! Используйте кнопки для действий.",
        Markup.keyboard([
          ["Добавить ссылку", "Добавить домен", "Проверить статус доменов"],
        ]).resize()
      );
    } else {
      return await ctx.reply(
        "Добро пожаловать! Используйте кнопки для действий.",
        Markup.keyboard([
          ["Добавить домен", "Проверить статус доменов"],
        ]).resize()
      );
    }
  }
});

bot.hears("RU RU", async (ctx) => {
  const userId = ctx.message.from.id;
  const user = await userSchema.findOne({ userId });

  if (!user) {
    await new userSchema({
      userId,
      type: "RU RU",
    }).save();

    return await ctx.reply(
      "Добро пожаловать! Используйте кнопки для действий.",
      Markup.keyboard([
        ["Добавить ссылку", "Добавить домен", "Проверить статус доменов"],
      ]).resize()
    );
  }
});

bot.hears("Facebook", async (ctx) => {
  const userId = ctx.message.from.id;
  const user = await userSchema.findOne({ userId });
  if (!user) {
    await new userSchema({
      userId,
      type: "Facebook",
    }).save();
    return await ctx.reply(
      "Добро пожаловать! Используйте кнопки для действий.",
      Markup.keyboard([["Добавить домен", "Проверить статус доменов"]]).resize()
    );
  }
});

bot.hears("Добавить ссылку", async (ctx) => {
  await ctx.scene.enter("addLink");
});

bot.hears("Добавить домен", async (ctx) => {
  await ctx.scene.enter("addDomain");
});

bot.hears("Проверить статус доменов", async (ctx) => {
  await ctx.scene.enter("checkDomainStatus");
});

// bot.on("text", (ctx) => {
//   ctx.reply("Пожалуйста, используйте кнопки для взаимодействия.");
// });

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
