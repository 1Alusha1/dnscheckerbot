import { Scenes } from "telegraf";
import UserSchema from "../models/user.js";

function isValidDomain(domain) {
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

export default function addDomain() {
  const scene = new Scenes.BaseScene("addDomain");
  scene.enter(async (ctx) => {
    await ctx.reply("Ввнди домен:");
  });

  scene.on("text", async (ctx) => {
    const text = ctx.message.text;
    const userId = ctx.from.id;

    if (!isValidDomain(text)) {
      await ctx.reply("❌ Не корректный домен");
      return await ctx.scene.leave();
    }

    try {
      const userDomains = await UserSchema.findOne({ userId });
      const domian = userDomains.domains.find((domain) => domain.name === text);

      if (domian) {
        return await ctx.reply("❌ Домен уже существует");
      }

      await UserSchema.updateOne(
        { userId },
        { $push: { domains: { name: text, active: true, displayed: false } } },
        { new: true }
      );

      await ctx.reply("✅ Домен успешно добавлен");
      return await ctx.scene.leave();
    } catch (err) {
      console.log(err);
      await ctx.reply("❌ Ошибка при добавлении домена");
      return await ctx.scene.leave();
    }
  });

  return scene;
}
