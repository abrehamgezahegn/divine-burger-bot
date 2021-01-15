const { menuItems } = require("../../staticData/menuItems");

exports.sendMealDetail = async (bot, msg, data) => {
  bot.sendPhoto(msg.chat.id, menuItems[data.meal_id].cover, {
    caption: menuItems[data.meal_id].mealDetail,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🍟 Add to cart",
            callback_data: JSON.stringify({
              type: "add_to_cart",
              meal_id: data.meal_id,
            }),
          },
          {
            text: "🙉 Cancel",
            callback_data: JSON.stringify({
              type: "show_order_menu",
            }),
          },
        ],
      ],
    },
  });
};
