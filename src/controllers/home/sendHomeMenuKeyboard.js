exports.sendHomeMenuKeyboard = (
  bot,
  msg,
  message = "Welcome to Divine burger, you seem hungry 🤔"
) => {
  bot.sendMessage(msg.chat.id, message, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        ["📖 Menu"],
        ["🍔 Order"],
        ["🛒 Cart"],
        ["📍 Location"],
        ["📷 Gallery", "📱 Contact"],
        ["🎖 Competitions", "🎇 Events"],
        ["Want a bot like this?"],
      ],
    },
  });
};
