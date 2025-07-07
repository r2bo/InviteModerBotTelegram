const { Markup } = require('telegraf');
const { getNameProject, getSupportUsername } = require('../database/settings');
const { sendInvite } = require('./invite');

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

async function sendCaptcha(ctx) {
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
  
  if (ctx.message?.message_id) {
    try { ctx.deleteMessage(ctx.message.message_id); } catch {}
  }
}

async function sendCaptchaAfterLangChange(ctx) {
  const { a, b, answer } = generateCaptcha();
  ctx.session.captcha = answer;
  
  const nameProject = await getNameProject() || 'ModerBot';
  const captchaText = ctx.t('captcha_after_lang_change').replace('{nameproject}', nameProject);
  
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
  
  if (ctx.message?.message_id) {
    try { ctx.deleteMessage(ctx.message.message_id); } catch {}
  }
}

async function handleCaptchaAnswer(ctx) {
  const answer = parseInt(ctx.message.text, 10);
  
  if (answer === ctx.session.captcha) {
    try { ctx.deleteMessage(ctx.message.message_id); } catch {}
    
    if (ctx.session.captchaMessageId) {
      try { ctx.deleteMessage(ctx.session.captchaMessageId); } catch {}
    }
    
    ctx.session.captcha = null;
    ctx.session.captchaMessageId = null;
    
    await sendInvite(ctx);
    
    return true;
  } else {
    try { ctx.deleteMessage(ctx.message.message_id); } catch {}
    
    if (ctx.session.captchaMessageId) {
      try {
        const supportUsername = await getSupportUsername();
        const supportButton = supportUsername ? [{ text: ctx.t('support'), url: `https://t.me/${supportUsername}` }] : [];
        
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          ctx.session.captchaMessageId,
          null,
          ctx.t('captcha_fail'),
          { 
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
              [{ text: ctx.t('try_captcha_again'), callback_data: 'new_captcha' }],
              [{ text: ctx.t('change_language'), callback_data: 'change_language' }],
              ...(supportButton.length > 0 ? [supportButton] : [])
            ])
          }
        );
      } catch (error) {
        // console.log('Failed to edit captcha fail message:', error.message);
      }
    }
    return false;
  }
}

async function handleNewCaptcha(ctx) {
  const { a, b, answer } = generateCaptcha();
  ctx.session.captcha = answer;
  
  const nameProject = await getNameProject() || 'ModerBot';
  const captchaText = ctx.t('captcha').replace('{nameproject}', nameProject);
  
  const supportUsername = await getSupportUsername();
  const supportButton = supportUsername ? [{ text: ctx.t('support'), url: `https://t.me/${supportUsername}` }] : [];
  
  try {
    await ctx.editMessageText(`${captchaText} ${a} + ${b} = ?`, { 
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [{ text: ctx.t('new_captcha'), callback_data: 'new_captcha' }],
        [{ text: ctx.t('change_language'), callback_data: 'change_language' }],
        ...(supportButton.length > 0 ? [supportButton] : [])
      ])
    });
  } catch (error) {
    // console.log('Failed to edit new captcha message:', error.message);
  }
}

module.exports = { sendCaptcha, sendCaptchaAfterLangChange, handleCaptchaAnswer, handleNewCaptcha }; 