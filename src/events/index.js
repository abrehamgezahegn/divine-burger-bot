const { initCallbackQuery } = require("./callbackQueryListener");
const { initContactListener } = require("./contactListener");
const { initLocationListener } = require("./locationListener");

module.exports = {
  initCallbackQuery,
  initContactListener,
  initLocationListener,
};
