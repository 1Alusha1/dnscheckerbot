import { Telegraf, Scenes, session, Markup } from 'telegraf';
import { config } from 'dotenv';
config();
import db from './db.js';
import addDomain from './scenes/addDomain.js';
import checkDomainStatus from './scenes/checkDomainStatus.js';
import startScene from './scenes/startScene.js';

const stage = new Scenes.Stage([
  addDomain(),
  checkDomainStatus(),
  startScene(),
]);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());
bot.use(stage.middleware());

db().catch((err) => console.log(err));

bot.start(async (ctx) => {
  await ctx.reply(
    'Добро пожаловать! Используйте кнопки для действий.',
    Markup.keyboard([
      ['🆕 Добавить домен', '📊 Проверить статус доменов'],
    ]).resize()
  );
});

bot.hears('🆕 Добавить домен', async (ctx) => {
  await ctx.scene.enter('addDomain');
});

bot.hears('📊 Проверить статус доменов', async (ctx) => {
  await ctx.scene.enter('checkDomainStatus');
});

bot.on('text', (ctx) => {
  ctx.reply('Пожалуйста, используйте кнопки для взаимодействия.');
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
