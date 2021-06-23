const { menuItems } = require("../staticData/menuItems");
const {
  sendOrderKeyboard,
  sendMealDetail,
  sendOrderConfirmation,
  createOrder,
  confirmOrder,
  updateOrderLocation,
} = require("../controllers/order");

const {
  sendEmptyCartMessage,
  emptyCart,
  addItemToCart,
  removeItemFromCart,
  showCart,
  sendItemAddedMessage,
} = require("../controllers/cart");
const { getUser } = require("../controllers/user");
const { sendHomeMenuKeyboard } = require("../controllers/home");

const {
  sendLocationOptions,
  acceptLocationDesc,
  sendLocationPrompt,
} = require("../controllers/location");

const { outsideView } = require("../staticData/gallery");

exports.initCallbackQuery = (bot) => {
  const sendContactPrompt = (msg) => {
    const contactOption = {
      parse_mode: "Markdown",
      one_time_keyboard: true,
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [
          [
            {
              text: "📱 My phone number",
              request_contact: true,
            },
          ],
          ["🏠 Back to home", "◀️ Back to order"],
        ],
      },
    };

    bot.sendMessage(msg.chat.id, "How can we contact you?", contactOption);
  };

  const sendOutsideView = (msg) => {
    bot.sendMediaGroup(msg.chat.id, outsideView);
  };

  bot.on("callback_query", async (query) => {
    const data = JSON.parse(query.data);
    bot.answerCallbackQuery(query.id);
    if (data.deleteKeyboard) {
      bot.deleteMessage(query.message.chat.id, query.message.message_id);
    }
    switch (data.type) {
      case "order": {
        sendMealDetail(bot, query.message, data);
        break;
      }
      case "place_order":
        await createOrder(query.message);

        const user = await getUser(query.message);

        if (user.cart.length === 0) {
          sendEmptyCartMessage(bot, query.message);
          break;
        }

        if (user.phoneNumber) {
          sendLocationOptions(bot, query.message);
        } else {
          sendContactPrompt(query.message);
        }
        break;
      case "share_location":
        sendLocationPrompt(bot, query.message);
        break;
      case "accept_location_desc":
        acceptLocationDesc(bot, query.message);
        break;
      case "order_at_divine":
        updateOrderLocation(query.message, "address", "At divine");
        sendOrderConfirmation(bot, query.message);
        break;

      case "drive_thru_order":
        updateOrderLocation(query.message, "address", "Drive-thru");
        sendOrderConfirmation(bot, query.message);

        break;
      case "add_to_cart":
        const { mealTitle, mealId, price } = menuItems[data.meal_id];
        addItemToCart(query.message, { mealTitle, mealId, price });
        sendItemAddedMessage(bot, query.message, mealTitle);
        break;

      case "remove_cart_item":
        removeItemFromCart(bot, query.message, data.cartItemIndex);
        break;
      case "empty_cart":
        emptyCart(query.message);
        bot.sendMessage(query.message.chat.id, `Your cart has been emptied.`, {
          parse_mode: "Markdown",
        });
        break;
      case "show_cart":
        showCart(bot, query.message);
        break;

      case "confirm_order":
        confirmOrder(bot, query.message);
        break;

      case "show_order_menu":
        sendOrderKeyboard(bot, query.message);
        break;
      case "send_outside_view":
        sendOutsideView(query.message);
        break;

      case "go_to_home":
        sendHomeMenuKeyboard(bot, query.message);
        break;
    }
  });
};
