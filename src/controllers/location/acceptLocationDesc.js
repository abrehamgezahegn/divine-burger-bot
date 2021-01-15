exports.acceptLocationDesc = (bot, msg) => {
  bot.sendMessage(msg.chat.id, "What's your location description?", {
    reply_markup: {
      force_reply: true,
    },
  });
};
