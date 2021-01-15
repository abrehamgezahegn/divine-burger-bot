exports.sendLocationPrompt = (bot, msg) => {
  const locationOption = {
    parse_mode: "Markdown",
    reply_markup: {
      one_time_keyboard: true,
      remove_keyboard: true,
      keyboard: [
        [
          {
            text: "📍 Share my location",
            request_location: true,
          },
        ],
        ["🏠 Back to home", "◀️ Back to order"],
      ],
    },
  };

  bot.sendMessage(
    msg.chat.id,
    "Please share your location using the button in your keyboard.",
    locationOption
  );
};
