const sequelize = require('./config');
const User = require('./models/User');
const Setting = require('./models/Setting');

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized.');
    
    const settingsCount = await Setting.count();
    if (settingsCount === 0) {
      await Setting.create({
        ChanelId: '',
        LoggingId: '',
        SupportUsername: '',
        nameproject: 'ModerBot'
      });
      console.log('Default settings created.');
    }
    
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

module.exports = { initDatabase, User, Setting }; 