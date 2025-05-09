import { Scenes } from 'telegraf';

export default function checkDomainStatus() {
  const scene = new Scenes.BaseScene('checkDomainStatus');

  scene.enter(async (ctx) => {
    try {
      await ctx.reply('Проверка началась:');

      const checkOwnResponse = await fetch(`${process.env.API_URI}/check-own/${ctx.from.id}`);
      if (!checkOwnResponse.ok) throw new Error('Ошибка при проверке API_URI');
    
      console.log(ctx.from.id);
    
      const googleSafeResponse = await fetch(`${process.env.API_URI}/google-safe-own/${ctx.from.id}`);
      if (!googleSafeResponse.ok) throw new Error('Ошибка при проверке GOOGLESAFE_API');
      await ctx.reply('Проверка завершилась');
      return await ctx.scene.leave();
    } catch (err) {
      if (err) console.log(err);
      await ctx.reply('Ошибка во время проверки статуса доменов');
    }
  });

  return scene;
}
