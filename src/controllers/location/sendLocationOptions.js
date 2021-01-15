exports.sendLocationOptions = async (bot, msg) => {
  bot.sendMessage(msg.chat.id, "Where should we deliver your order?", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📍 My location",
            callback_data: JSON.stringify({
              type: "share_location",
              deleteKeyboard: true,
            }),
          },
        ],
        [
          {
            text: "🗺 Other location",
            callback_data: JSON.stringify({
              type: "accept_location_desc",
              deleteKeyboard: true,
            }),
          },
        ],
        [
          {
            text: "🍔 At Divine",
            callback_data: JSON.stringify({
              type: "order_at_divine",
              deleteKeyboard: true,
            }),
          },
        ],
        [
          {
            text: "🚗 I will come an pick up (Drive-Thru )",
            callback_data: JSON.stringify({
              type: "drive_thru_order",
              deleteKeyboard: true,
            }),
          },
        ],
      ],
    },
  });
};
