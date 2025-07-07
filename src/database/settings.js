const { Setting } = require('./index');

async function getSettings() {
  return await Setting.findOne();
}

async function updateSettings({ ChanelId, LoggingId, SupportUsername, nameproject }) {
  await Setting.update({ ChanelId, LoggingId, SupportUsername, nameproject }, { where: { id: 1 } });
}

async function getChanelId() {
  const settings = await getSettings();
  return settings?.ChanelId;
}

async function getLoggingId() {
  const settings = await getSettings();
  return settings?.LoggingId;
}

async function getSupportUsername() {
  const settings = await getSettings();
  return settings?.SupportUsername;
}

async function getNameProject() {
  const settings = await getSettings();
  return settings?.nameproject;
}

module.exports = { getSettings, updateSettings, getChanelId, getLoggingId, getSupportUsername, getNameProject }; 