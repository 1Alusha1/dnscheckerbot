import { Scenes } from "telegraf";
import UserSchema from "../models/user.js";

export default function addLink() {
  const scene = new Scenes.BaseScene("addLink");
  scene.enter(async (ctx) => {
    await ctx.reply("Ввнди ссылку:");
  });

  scene.on("text", async (ctx) => {
    const text = ctx.message.text;
    const userId = ctx.from.id;

    try {
      const userLink = await UserSchema.findOne({ userId });

      const link = userLink.links.find((domain) => domain.name === text);

      if (link) {
       return await ctx.reply("❌ Ссылка уже существует");
      }

      await UserSchema.updateOne(
        { userId },
        { $push: { links: { name: text.trim(), active: true, displayed: false } } },
        { new: true }
      );

      await ctx.reply("✅ Ссылка успешно добавлен");
      return await ctx.scene.leave();
    } catch (err) {
      console.log(err);
      await ctx.reply("❌ Ошибка при добавлении домена");
      return await ctx.scene.leave();
    }
  });

  return scene;
}
