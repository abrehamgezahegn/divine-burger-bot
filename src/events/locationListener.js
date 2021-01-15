const { updateOrderLocation } = require("../controllers/order");
const { acceptLocationDesc } = require("../controllers/location");

exports.initLocationListener = (bot) => {
  bot.on("location", async (msg) => {
    updateOrderLocation(msg);
    acceptLocationDesc(bot, msg);
  });
};
