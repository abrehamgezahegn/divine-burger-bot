const { Order } = require("../../schemas");
const { getUser } = require("../user");

exports.sendOrderConfirmation = async (bot, msg) => {
  const user = await getUser(msg);
  const orders = await Order.find().and({ userChatId: msg.chat.id });
  const order = orders[orders.length - 1];

  let msgReplyMarkup = {};
  let locationReplyMarkup = {
    reply_markup: {
      one_time_keyboard: true,
      inline_keyboard: [
        [
          {
            text: "✅ Confirm Order",
            callback_data: JSON.stringify({
              type: "confirm_order",
              deleteKeyboard: true,
            }),
          },
        ],
      ],
    },
  };
  if (!order.longitude) {
    msgReplyMarkup = locationReplyMarkup;
  }

  bot.sendMessage(
    msg.chat.id,
    `   \n\n\n\n🛵 Delivery details 🛵 \n📱 ${user.phoneNumber} \n📍 ${order.address} \n\n`,
    msgReplyMarkup
  );

  if (order.latitude)
    setTimeout(() => {
      bot.sendLocation(
        msg.chat.id,
        order.latitude,
        order.longitude,
        locationReplyMarkup
      );
    }, 500);
};
