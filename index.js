process.env.NTBA_FIX_319 = 1;

const TelegramBot = require("node-telegram-bot-api");
const token = "1414429912:AAGe8qIBAFEloaEGaY-FXeApFFJupxrKcFI";
const bot = new TelegramBot(token, { polling: true });

const { menuItems } = require("./staticData/menuItems");
const { albumOne, albumTwo } = require("./staticData/gallery");
const { orderKeyboard } = require("./staticData/keyboards");

const sendHomeMenuKeyboard = (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome, You seem hungry", {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        ["📖 Menu"],
        ["🍔 Order"],
        ["📍 Location"],
        ["📷 Gallery", "📱 Contact"],
        ["🎖 Competitions", "💸 Deals / Discounts"],
      ],
    },
  });
};

const sendOrderKeyboard = (msg) => {
  bot.sendMessage(msg.chat.id, "What should we get you?", {
    reply_markup: {
      inline_keyboard: orderKeyboard,
    },
  });
};

const sendMenuPicture = (msg) => {
  bot.sendPhoto(
    msg.chat.id,
    "https://res.cloudinary.com/de5awe7fs/image/upload/v1609099462/Divine/photo_2020-12-27_23-04-10.jpg"
  );
};

const sendLocation = (msg) => {
  console.log("msg", msg);
  bot.sendLocation(msg.chat.id, 8.998793301318967, 38.78529252962021);
  bot.sendMessage(msg.chat.id, "📍 Bole new building behind Sheger building", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open in maps",
            url:
              "https://www.google.com/maps/place/Divine+Burger/@8.9987837,38.7831049,17z/data=!3m1!4b1!4m5!3m4!1s0x164b859bbc283e9b:0xe2840693f0f71555!8m2!3d8.9987784!4d38.7852989",
          },
        ],
      ],
    },
  });
};

const sendCompetitions = (msg) => {
  bot.sendMessage(msg.chat.id, "No ongoing competitions :(. Stay tuned");
};

const sendDealsAndDiscounts = (msg) => {
  bot.sendMessage(msg.chat.id, "No ongoing deals or discounts :(.");
};

const sendGallery = (msg) => {
  bot.sendMediaGroup(msg.chat.id, albumOne);

  bot.sendMediaGroup(msg.chat.id, albumTwo);
};

bot.onText(/\/start/, (msg) => {
  sendHomeMenuKeyboard(msg);
});

bot.on("message", (msg) => {
  if (msg.text === "📖 Menu") {
    sendMenuPicture(msg);
  }
  if (msg.text === "🍔 Order") {
    sendOrderKeyboard(msg);
  }

  if (msg.text === "📍 Location") {
    sendLocation(msg);
  }

  if (msg.text === "🎖 Competitions") {
    sendCompetitions(msg);
  }
  if (msg.text === "💸 Deals / Discounts") {
    sendDealsAndDiscounts(msg);
  }
  if (msg.text === "📷 Gallery") {
    sendGallery(msg);
  }
  if (msg.text === "Home") {
    sendHomeMenuKeyboard(msg);
  }
});

const orders = {};

bot.on("callback_query", (query) => {
  const data = JSON.parse(query.data);
  const chat = query.message.chat;

  switch (data.type) {
    case "order": {
      bot.sendPhoto(chat.id, menuItems[data.meal_id].cover);
      bot.sendMessage(chat.id, menuItems[data.meal_id].mealDetail, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🍟 Place order",
                callback_data: JSON.stringify({
                  type: "place_order",
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
      break;
    }
    case "place_order":
      orders[chat.id] = data.meal_id;
      const contactOption = {
        parse_mode: "Markdown",
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [
            [
              {
                text: "My phone number",
                request_contact: true,
              },
            ],
            ["Cancel"],
          ],
        },
      };

      bot.sendMessage(chat.id, "How can we contact you?", contactOption);

      break;
    case "show_order_menu":
      sendOrderKeyboard(query.message);
      break;
  }
});

const contacts = {};

bot.on("contact", (msg) => {
  const locationOption = {
    parse_mode: "Markdown",
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        [
          {
            text: "My location",
            request_location: true,
          },
        ],
        ["Cancel"],
      ],
    },
  };

  contacts[msg.chat.id] = msg.contact.phone_number;

  bot.sendMessage(
    msg.chat.id,
    "Where should we deliver your order?",
    locationOption
  );
});

bot.on("location", (msg) => {
  bot
    .sendMessage(
      msg.chat.id,
      `Thank you ${msg.chat.first_name} 😁. Your order is through 🎊🎊🎊.`
    )
    .then(() => {
      const meal = menuItems[orders[msg.chat.id]];
      bot
        .sendMessage(
          -403696679,
          `   \n\n\n\n🛵 New order 🛵 \n\n🍔 ${meal.mealTitle} \n🧔 ${
            msg.chat.first_name
          } \n📱 ${contacts[msg.chat.id]} \n💬 @${
            msg.chat.username
          } \n\n 👇👇👇`
        )
        .then(() => {
          bot.sendLocation(
            -403696679,
            msg.location.latitude,
            msg.location.longitude
          );
        })
        .then(() => {
          bot.sendVideo(
            msg.chat.id,
            "https://res.cloudinary.com/de5awe7fs/video/upload/v1609376029/Divine/gallery/order_complete.mp4"
          );
        })
        .then(() => {
          sendHomeMenuKeyboard(msg);
        });
    });
});

console.log("server up and running");
