const { orderKeyboard } = require("../../staticData/keyboards");

exports.sendOrderKeyboard = async (bot, msg) => {
  bot.sendMessage(msg.chat.id, "What should we get you?", {
    reply_markup: {
      inline_keyboard: orderKeyboard,
    },
  });
};
