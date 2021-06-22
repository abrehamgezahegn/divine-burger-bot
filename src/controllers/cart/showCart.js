const { getUser } = require("../user");
const { generateOrderDetails } = require("../../utils/generateOrderDetails");
const { sendEmptyCartMessage } = require("./sendEmptyCartMessage");

exports.showCart = async (bot, msg) => {
  const user = await getUser(msg);

  if (user.cart.length === 0) {
    sendEmptyCartMessage(bot, msg);

    return;
  }

  const title = `*Your cart 🛒*\n\n`;
  const messageBody = generateOrderDetails(user);
  const message = title + messageBody;

  let keyboardItems = [];
  user.cart.forEach((item, index) => {
    const keyboardItem = {
      text: `${item.mealTitle} ❌`,
      callback_data: JSON.stringify({
        type: "remove_cart_item",
        cartItemIndex: index,
      }),
    };
    keyboardItems.push([keyboardItem]);
  });

  let cartKeyboard = {
    parse_mode: "Markdown",

    reply_markup: {
      one_time_keyboard: true,
      inline_keyboard: [
        ...keyboardItems,
        [
          {
            text: "✅ Place Order",
            callback_data: JSON.stringify({
              type: "place_order",
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

  bot.sendMessage(msg.chat.id, message, cartKeyboard);
};
