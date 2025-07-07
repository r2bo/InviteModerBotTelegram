const { Markup } = require('telegraf');
const { getChanelId, getSupportUsername } = require('../database/settings');
const { getNameProject } = require('../database/settings');

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

async function sendCaptchaFromInvite(ctx) {
  const { a, b, answer } = generateCaptcha();
  ctx.session.captcha = answer;
  
  const nameProject = await getNameProject() || 'ModerBot';
  const captchaText = ctx.t('captcha').replace('{nameproject}', nameProject);
  
  const supportUsername = await getSupportUsername();
  const supportButton = supportUsername ? [{ text: ctx.t('support'), url: `https://t.me/${supportUsername}` }] : [];
  
  const msg = await ctx.reply(`${captchaText} ${a} + ${b} = ?`, { 
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [{ text: ctx.t('new_captcha'), callback_data: 'new_captcha' }],
      [{ text: ctx.t('change_language'), callback_data: 'change_language' }],
      ...(supportButton.length > 0 ? [supportButton] : [])
    ])
  });
  ctx.session.captchaMessageId = msg.message_id;
}

async function createInviteLink() {
  const chanelId = await getChanelId();
  if (!chanelId) return null;
  
  return await global.bot.telegram.createChatInviteLink(chanelId, {
    expire_date: Math.floor(Date.now() / 1000) + 60 * 5,
    member_limit: 1
  });
}

async function sendInvite(ctx) {
  const link = await createInviteLink();
  
  const supportUsername = await getSupportUsername();
  const supportButton = supportUsername ? [{ text: ctx.t('support'), url: `https://t.me/${supportUsername}` }] : [];
  
  if (link) {
    await ctx.reply(`${ctx.t('success_with_invite')} ${link.invite_link}`, { 
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [{ text: ctx.t('go_to_chat'), url: link.invite_link }],
        [{ text: ctx.t('new_invite'), callback_data: 'new_invite' }],
        [{ text: ctx.t('change_language'), callback_data: 'change_language' }],
        ...(supportButton.length > 0 ? [supportButton] : [])
      ])
    });
    return true;
  } else {
    await ctx.reply(ctx.t('error'), { 
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [{ text: ctx.t('try_again'), callback_data: 'retry' }],
        [{ text: ctx.t('change_language'), callback_data: 'change_language' }],
        ...(supportButton.length > 0 ? [supportButton] : [])
      ])
    });
    return false;
  }
}

async function handleNewInvite(ctx) {
  try { await ctx.deleteMessage(); } catch {}
  await sendCaptchaFromInvite(ctx);
}

module.exports = { sendInvite, handleNewInvite }; 