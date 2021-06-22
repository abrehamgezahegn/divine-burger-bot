exports.sendEmptyCartMessage = (bot, msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Your cart is empty. Go to orders to add items.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🍔 Order",
              callback_data: JSON.stringify({
                type: "show_order_menu",
                deleteKeyboard: true,
              }),
            },
          ],
        ],
      },
    }
  );
};
