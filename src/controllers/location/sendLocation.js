exports.sendLocation = (bot, msg) => {
  bot.sendLocation(msg.chat.id, 8.998793301318967, 38.78529252962021);
  bot.sendMessage(
    msg.chat.id,
    "📍 Bole new building behind Sheger building, above Dashen bank.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📷 Outside view",
              callback_data: JSON.stringify({
                type: "send_outside_view",
              }),
            },
          ],
        ],
      },
    }
  );
};
