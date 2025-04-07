import { Markup, Scenes } from "telegraf";

import DomainSchema from "../models/domain.js";

function isValidDomain(domain) {
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

export default function startScene() {
  const scene = new Scenes.BaseScene("startScene");
  scene.enter(async (ctx) => {
    await ctx.reply(
      "Привет, ниже доступные команды",
      Markup.inlineKeyboard([
        Markup.button.callback(`🆕 Добавить домен`, `addDomain`),
        Markup.button.callback(`📊 Проверить статус доменов`, `checkStatus`),
      ])
        .oneTime()
        .resize()
    );
  });

  return scene;
}
