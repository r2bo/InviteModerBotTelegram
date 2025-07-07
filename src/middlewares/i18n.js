const fs = require('fs');
const path = require('path');
const { getUser } = require('../database/user');

const locales = {
  ru: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/ru.json'))),
  en: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/en.json')))
};

async function i18n(ctx, next) {
  let lang = 'ru';
  
  if (ctx.from) {
    const user = await getUser(ctx.from.id);
    if (user && user.lang) {
      lang = user.lang;
      // console.log('User language from DB:', lang);
    } else {
      // console.log('User language not set or null, using default:', lang);
    }
  }
  
  // console.log('Final language for ctx.t:', lang);
  ctx.t = (key) => {
    const result = locales[lang][key] || key;
    // console.log(`Translation for "${key}":`, result);
    return result;
  };
  ctx.lang = lang;
  await next();
}

module.exports = i18n; 