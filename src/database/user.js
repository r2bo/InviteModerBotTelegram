const { User } = require('./index');

async function createUser(userData) {
  try {
    const user = await User.create({
      id: userData.id,
      username: userData.username,
      lang: userData.lang || null
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

async function getUser(userId) {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

async function setLang(userId, lang) {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      user.lang = lang;
      await user.save();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error setting language:', error);
    return false;
  }
}

async function setAdmin(id, admin) {
  await User.update({ admin }, { where: { id } });
}

module.exports = { createUser, getUser, setLang, setAdmin }; 