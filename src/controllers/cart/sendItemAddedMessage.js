exports.sendItemAddedMessage = (bot, msg, mealTitle) => {
  const cartOptions = {
    parse_mode: "Markdown",
    reply_markup: {
      one_time_keyboard: true,
      inline_keyboard: [
        [
          {
            text: "🛒 Show cart",
            callback_data: JSON.stringify({
              type: "show_cart",
            }),
          },
          {
            text: "🍔 Order more",
            callback_data: JSON.stringify({
              type: "show_order_menu",
            }),
          },
        ],
      ],
    },
  };

  bot.sendMessage(
    msg.chat.id,
    `1 *${mealTitle}* added to your cart 🚀. You can checkout or add more items to your cart`,
    cartOptions
  );
};
