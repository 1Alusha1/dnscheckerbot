import { Scenes } from 'telegraf';

import DomainSchema from '../models/domain.js';

function isValidDomain(domain) {
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

export default function addDomain() {
  const scene = new Scenes.BaseScene('addDomain');
  scene.enter(async (ctx) => {
    await ctx.reply('Ввнди домен:');
  });

  scene.on('text', async (ctx) => {
    const text = ctx.message.text;
    if (!isValidDomain(text)) {
      await ctx.reply('❌ Не корректный домен');
      return await ctx.scene.leave();
    }

    try {
      const domain = await new DomainSchema({
        domain: text,
        userId: ctx.from.id,
      });
      await domain.save();
      await ctx.reply('✅ Домен успешно добавлен');
      return await ctx.scene.leave();
    } catch (err) {
      await ctx.reply('❌ Ошибка при добавлении домена');
      return await ctx.scene.leave();
    }
  });

  return scene;
}
