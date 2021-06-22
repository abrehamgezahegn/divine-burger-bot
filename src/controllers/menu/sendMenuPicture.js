exports.sendMenuPicture = async (bot, msg) => {
  bot.sendPhoto(
    msg.chat.id,
    "https://res.cloudinary.com/de5awe7fs/image/upload/v1609099462/Divine/photo_2020-12-27_23-04-10.jpg",

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
