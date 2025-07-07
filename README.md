# ModerBot 🤖

> Многоязычный Telegram-бот с капчей и временными приглашениями

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Telegraf](https://img.shields.io/badge/Telegraf-4.0+-blue.svg)](https://telegraf.js.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[![telegram-bot](https://img.shields.io/badge/telegram--bot-blue.svg)](https://github.com/topics/telegram-bot)
[![nodejs](https://img.shields.io/badge/nodejs-green.svg)](https://github.com/topics/nodejs)
[![telegraf](https://img.shields.io/badge/telegraf-blue.svg)](https://github.com/topics/telegraf)
[![captcha](https://img.shields.io/badge/captcha-orange.svg)](https://github.com/topics/captcha)
[![multilingual](https://img.shields.io/badge/multilingual-purple.svg)](https://github.com/topics/multilingual)

## ✨ Возможности

- 🌍 **Многоязычность** - русский и английский языки
- 🔐 **Капча** - математическая проверка для защиты от ботов
- 🔗 **Временные ссылки** - приглашения в чат на 5 минут
- 👥 **Управление пользователями** - база данных MySQL
- ⚙️ **Настройки через БД** - гибкая конфигурация
- 🎨 **Красивый UI** - HTML-разметка и эмодзи

## 🚀 Быстрый старт

### Установка

```bash
git clone https://github.com/r2bo/InviteModerBotTelegram.git
cd InviteModerBotTelegram
npm install
```

### Настройка

1. **Создайте `.env` файл:**
```env
BOT_TOKEN=your_telegram_bot_token
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

2. **Настройте базу данных MySQL**

3. **Запустите бота:**
```bash
node src/index.js
```

## 📊 База данных

### Таблица `Users`
- `id` - ID пользователя в Telegram
- `username` - username пользователя  
- `admin` - права администратора
- `lang` - язык интерфейса

### Таблица `Settings`
- `ChanelId` - ID канала для приглашений
- `LoggingId` - ID канала для логирования
- `SupportUsername` - username поддержки

## 🛠 Технологии

- **Node.js** - среда выполнения
- **Telegraf** - Telegram Bot API
- **Sequelize** - ORM для MySQL
- **telegraf-session-local** - локальные сессии

## 📁 Структура

```
src/
├── database/          # База данных
│   ├── models/       # Модели Sequelize
│   ├── config.js     # Конфигурация БД
│   └── index.js      # Инициализация
├── locales/          # Локализация
│   ├── ru.json       # Русский
│   └── en.json       # Английский
├── modules/          # Модули
│   ├── captcha.js    # Система капчи
│   └── invite.js     # Приглашения
├── middlewares/      # Middleware
│   └── i18n.js      # Интернационализация
└── index.js          # Основной файл
```

## 🎯 Как работает

1. **Старт** → Пользователь выбирает язык
2. **Капча** → Математическая проверка
3. **Приглашение** → Временная ссылка на 5 минут
4. **Вход** → Одноразовая ссылка для входа в чат

## 🔧 Настройка бота

1. Найдите [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте токен в `.env`

## 📞 Поддержка

**Разработчик:** [@r2codex](https://t.me/r2codex)

---

⭐ Если проект понравился, поставьте звездочку!

---

**Теги:** `telegram-bot` `nodejs` `telegraf` `captcha` `multilingual` `mysql` `sequelize` `i18n` `invite-system` 
