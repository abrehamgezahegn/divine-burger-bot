const { User } = require("../../schemas");
const { getUser } = require("../user");
const { showCart } = require("./showCart");
const { sendEmptyCartMessage } = require("./sendEmptyCartMessage");

exports.removeItemFromCart = async (bot, msg, cartItemIndex) => {
  const user = await getUser(msg);
  const item = user.cart[cartItemIndex];

  if (!item) return;

  if (user.cart.length === 0) {
    bot.sendMessage(
      msg.chat.id,
      `You have already removed that item from your cart`,
      { parse_mode: "Markdown" }
    );
    return;
  }

  const filtered = user.cart.filter((_, index) => index !== cartItemIndex);
  await User.findByIdAndUpdate(user._id, { cart: filtered });
  bot.sendMessage(
    msg.chat.id,
    `*${item.mealTitle}* has been removed from your cart`,
    { parse_mode: "Markdown" }
  );

  if (filtered.length > 0) showCart(bot, msg);
  else sendEmptyCartMessage(bot, msg);
};
