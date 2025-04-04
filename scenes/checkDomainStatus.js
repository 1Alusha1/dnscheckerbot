import { Scenes } from "telegraf";

export default function checkDomainStatus() {
  const scene = new Scenes.BaseScene("checkDomainStatus");

  scene.enter(async (ctx) => {
    try {
      await fetch(`${process.env.API_URI}/check-own/${ctx.from.id}`);

      return ctx.scene.leave();
    } catch (err) {
      if (err) console.log(err);
      await ctx.reply("Ошибка во время проверки статуса доменов");
    }
  });

  return scene;
}
