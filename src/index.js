require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const LocalSession = require('telegraf-session-local');
const i18n = require('./middlewares/i18n');
const { createUser, getUser, setLang } = require('./database/user');
const { initDatabase } = require('./database');
const { getSupportUsername } = require('./database/settings');
const { sendCaptcha, sendCaptchaAfterLangChange, handleCaptchaAnswer, handleNewCaptcha } = require('./modules/captcha');
const { sendInvite, handleNewInvite } = require('./modules/invite');

const bot = new Telegraf(process.env.BOT_TOKEN);
global.bot = bot;

const localSession = new LocalSession({
  database: 'sessions.json',
  property: 'session',
  storage: LocalSession.storageFileAsync,
  format: {
    serialize: (obj) => JSON.stringify(obj, null, 2),
    deserialize: (str) => JSON.parse(str),
  },
  state: { messages: [] }
});

localSession.DB.then(DB => {
  // console.log('LocalSession DB initialized:', DB.value());
});

bot.use(localSession.middleware());
bot.use(i18n);

bot.start(async (ctx) => {
  if (ctx.message && ctx.message.message_id) {
    try { await ctx.deleteMessage(ctx.message.message_id); } catch {}
  }
  
  const user = await getUser(ctx.from.id);
  
  if (!user) {
    await createUser({ id: ctx.from.id, username: ctx.from.username, lang: null });
    
    const startText = "👋 <b>Welcome! / Добро пожаловать!</b>\n\n🌍 Please choose your language / Выберите язык:\n🇷🇺 Русский\n🇬🇧 English";
    
    const msg = await ctx.reply(startText, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [
          { text: '🇷🇺 Русский', callback_data: 'lang_ru' },
          { text: '🇬🇧 English', callback_data: 'lang_en' }
        ]
      ])
    });
    ctx.session.startMessageId = msg.message_id;
    return;
  }
  
  if (!user.lang) {
    const startText = "👋 <b>Welcome! / Добро пожаловать!</b>\n\n🌍 Please choose your language / Выберите язык:\n🇷🇺 Русский\n🇬🇧 English";
    
    const msg = await ctx.reply(startText, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [
          { text: '🇷🇺 Русский', callback_data: 'lang_ru' },
          { text: '🇬🇧 English', callback_data: 'lang_en' }
        ]
      ])
    });
    ctx.session.startMessageId = msg.message_id;
    return;
  }
  
  const supportUsername = await getSupportUsername();
  const supportButton = supportUsername ? [{ text: ctx.t('support'), url: `https://t.me/${supportUsername}` }] : [];
  
  await ctx.reply(ctx.t('already_registered'), {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [{ text: ctx.t('get_new_link'), callback_data: 'get_new_link' }],
      [{ text: ctx.t('change_language'), callback_data: 'change_language' }],
      ...(supportButton.length > 0 ? [supportButton] : [])
    ])
  });
});

bot.action('lang_ru', async (ctx) => {
  try { await ctx.deleteMessage(); } catch {}
  await handleLanguageSelection(ctx, 'ru');
});

bot.action('lang_en', async (ctx) => {
  try { await ctx.deleteMessage(); } catch {}
  await handleLanguageSelection(ctx, 'en');
});

bot.action('change_language', async (ctx) => {
  try { await ctx.deleteMessage(); } catch {}
  const startText = "👋 <b>Welcome! / Добро пожаловать!</b>\n\n🌍 Please choose your language / Выберите язык:\n🇷🇺 Русский\n🇬🇧 English";
  
  const msg = await ctx.reply(startText, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [
        { text: '🇷🇺 Русский', callback_data: 'lang_ru' },
        { text: '🇬🇧 English', callback_data: 'lang_en' }
      ]
    ])
  });
  ctx.session.startMessageId = msg.message_id;
});

bot.action('get_new_link', async (ctx) => {
  try { await ctx.deleteMessage(); } catch {}
  await sendCaptcha(ctx);
});

bot.action('restart', async (ctx) => {
  try { await ctx.deleteMessage(); } catch {}
  const user = await getUser(ctx.from.id);
  if (user) await setLang(ctx.from.id, 'ru');
  await sendCaptcha(ctx);
});

bot.action('new_captcha', async (ctx) => {
  await handleNewCaptcha(ctx);
});

bot.action('new_invite', async (ctx) => {
  await handleNewInvite(ctx);
});

bot.action('retry', async (ctx) => {
  try { await ctx.deleteMessage(); } catch {}
  await sendCaptcha(ctx);
});

async function handleLanguageSelection(ctx, lang) {
  await setLang(ctx.from.id, lang);
  
  const i18nMiddleware = require('./middlewares/i18n');
  await i18nMiddleware(ctx, async () => {});
  
  if (ctx.session.startMessageId) {
    try { await ctx.deleteMessage(ctx.session.startMessageId); } catch {}
  }
  
  await sendCaptchaAfterLangChange(ctx);
}

bot.on('message', async (ctx) => {
  const user = await getUser(ctx.from.id);
  if (!user) return;
  if (ctx.session.captcha) {
    await handleCaptchaAnswer(ctx);
  }
});

async function startBot() {
  await initDatabase();
  bot.launch();
}

startBot(); 