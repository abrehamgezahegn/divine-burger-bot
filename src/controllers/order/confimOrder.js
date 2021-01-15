const { getUser } = require("../user");
const { sendEmptyCartMessage } = require("../cart");
const {
  getRandomFreshPrinceGIF,
} = require("../../utils/getRandomFreshPrinceGif");
const { generateOrderDetails } = require("../../utils/generateOrderDetails");
const { getUserName } = require("../../utils/getUserName");
const { getHandEmojis } = require("../../utils/getHandEmojis");
const { Order } = require("../../schemas");
const { emptyCart } = require("../cart");

exports.confirmOrder = async (bot, msg) => {
  const user = await getUser(msg);

  if (user.cart.length === 0) {
    sendEmptyCartMessage(bot, msg);
    return;
  }

  bot
    .sendVideo(msg.chat.id, getRandomFreshPrinceGIF(), {
      caption: `Thank you ${msg.chat.first_name} 😁. Your order is through 🎊🎊🎊.\n\nDo you have another order?`,
      reply_markup: {
        one_time_keyboard: true,
        inline_keyboard: [
          [
            {
              text: "Yes",
              callback_data: JSON.stringify({
                type: "show_order_menu",
              }),
            },
            {
              text: "Nope",
              callback_data: JSON.stringify({
                type: "go_to_home",
              }),
            },
          ],
        ],
      },
    })
    .then((_) => {
      bot.deleteMessage(msg.chat.id, msg.message_id);
    })
    .then(async () => {
      const orders = await Order.find().and({ userChatId: msg.chat.id });
      const order = orders[orders.length - 1];
      const user = await getUser(msg);

      await Order.findByIdAndUpdate(order._id, {
        status: "Pending",
        cart: user.cart,
      });

      const orderDetail = generateOrderDetails(user);
      bot
        .sendMessage(
          process.env.TELEGRAM_GROUP_ID,
          `   \n\n\n\n🛵 New order 🛵 \n\n${orderDetail} \n\n🧔 ${
            msg.chat.first_name
          } \n📱 ${user.phoneNumber} \n📍 ${order.address} \n${getUserName(
            msg
          )} \n\n ${getHandEmojis(order)}`
        )
        .then(() => {
          emptyCart(msg);
          if (order.longitude) {
            bot.sendLocation(
              process.env.TELEGRAM_GROUP_ID,
              order.latitude,
              order.longitude
            );
          }
        });
    });
};
