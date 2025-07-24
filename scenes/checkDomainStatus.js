import { Scenes } from "telegraf";
import UserSchema from "../models/user.js";

export default function checkDomainStatus() {
  const scene = new Scenes.BaseScene("checkDomainStatus");
  scene.enter(async (ctx) => {
    try {
      const userId = ctx.from.id;
      const user = await UserSchema.findOne({ userId });

      await ctx.reply("Проверка началась:");
      if (user.type === "RU RU") {
        console.log("RU RU");
        const checkOwnResponse = await fetch(
          `${process.env.API_URI}/check-own/${userId}`
        );
        if (!checkOwnResponse.ok)
          throw new Error("Ошибка при проверке API_URI");
      } else {
        const googleSafeResponse = await fetch(
          `${process.env.API_URI}/google-safe-own/${userId}`
        );
        if (!googleSafeResponse.ok)
          throw new Error("Ошибка при проверке GOOGLESAFE_API");
        await ctx.reply("Проверка завершилась");
      }
      return await ctx.scene.leave();
    } catch (err) {
      if (err) console.log(err);
      await ctx.reply("Ошибка во время проверки статуса доменов");
    }
  });

  return scene;
}
