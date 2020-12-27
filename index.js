process.env.NTBA_FIX_319 = 1;

const TelegramBot = require("node-telegram-bot-api");
const token = "1414429912:AAGe8qIBAFEloaEGaY-FXeApFFJupxrKcFI";
const bot = new TelegramBot(token, { polling: true });

const sendHomeMenuKeyboard = (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome, You seem hungry", {
    reply_markup: {
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
      inline_keyboard: [
        [
          {
            text: "Becon Delux (Free coke) ",
            callback_data: JSON.stringify({
              type: "order",
              meal: "Becon Delux",
              price: 205,
              meal_id: 1,
            }),
          },
        ],
        [
          {
            text: "Crispy chicken special",
            callback_data: JSON.stringify({
              type: "order",
              meal: "Crispy chicken",
              price: 186,
              meal_id: 2,
            }),
          },
        ],
        [
          {
            text: "Divine junkie",
            callback_data: JSON.stringify({
              type: "order",
              meal: "Divine junkie",
              price: 176,
              meal_id: 3,
            }),
          },
        ],
        [
          {
            text: "Pastrami burger",
            callback_data: JSON.stringify({
              type: "order",
              meal: "Pastrami",
              price: 150,
              meal_id: 4,
            }),
          },
        ],
        [
          {
            text: "Smoken' Spice",
            callback_data: JSON.stringify({
              type: "order",
              meal: "Spice",
              price: 146,
              meal_id: 5,
            }),
          },
        ],
        [
          {
            text: "California style",
            callback_data: JSON.stringify({
              type: "order",
              meal: "Cali",
              price: 120,
              meal_id: 6,
            }),
          },
        ],
        [
          {
            text: "French Fries",
            callback_data: JSON.stringify({
              type: "order",
              meal: "fries",
              price: 50,
              meal_id: 7,
            }),
          },
        ],
        [
          {
            text: "Coke",
            callback_data: JSON.stringify({
              type: "order",
              meal: "Coke",
              price: 16,
              meal_id: 8,
            }),
          },
        ],
      ],
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
  bot.sendMediaGroup(msg.chat.id, [
    {
      type: "photo",
      media:
        "https://res.cloudinary.com/de5awe7fs/image/upload/v1609099378/Divine/gallery/photo_2020-12-26_23-58-20.jpg",
    },
    {
      type: "video",
      media:
        "https://res.cloudinary.com/de5awe7fs/video/upload/v1609099249/Divine/IMG_4182.mp4",
    },
    {
      type: "photo",
      media:
        "https://res.cloudinary.com/de5awe7fs/image/upload/v1609099377/Divine/gallery/photo_2020-12-27_00-02-19.jpg",
    },
    {
      type: "photo",
      media:
        "https://res.cloudinary.com/de5awe7fs/image/upload/v1609099376/Divine/gallery/photo_2020-12-27_00-03-11.jpg",
    },
  ]);

  bot.sendMediaGroup(msg.chat.id, [
    {
      type: "photo",
      media:
        "https://res.cloudinary.com/de5awe7fs/image/upload/v1609099199/Divine/photo_2020-12-27_00-07-06.jpg",
    },
    {
      type: "photo",
      media:
        "https://res.cloudinary.com/de5awe7fs/video/upload/v1609099386/Divine/gallery/IMG_4182.mp4",
    },
    {
      type: "photo",
      media:
        "https://drive.google.com/file/d/15G_1dgDqKqo_StF4GAFvLkCTJ952sPBX/view?usp=sharing",
    },
    {
      type: "photo",
      media:
        "https://res.cloudinary.com/de5awe7fs/image/upload/v1609099380/Divine/gallery/photo_2020-12-26_23-58-15.jpg",
    },
  ]);
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

bot.on("callback_query", (query) => {
  const data = JSON.parse(query.data);
  const chat = query.message.chat;
  console.log("query ", query);

  switch (data.type) {
    case "order": {
      if (data.meal_id === 1) {
        bot.sendPhoto(
          chat.id,
          "https://res.cloudinary.com/de5awe7fs/image/upload/v1609099380/Divine/gallery/photo_2020-12-26_23-58-15.jpg"
        );
        bot.sendMessage(
          chat.id,
          "🍔 Becon Delux \n💰 205Birr \n👨‍🍳 Double patty , double sliced cheese , double bacon with American cheese,  double  sliced beef. -with a free coca cola \n ",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Confirm",
                    callback_data: JSON.stringify({
                      type: "confirm_order",
                      order: data.meal_id,
                      userName: chat.username,
                    }),
                  },
                  {
                    text: "Changed my mind",
                    callback_data: JSON.stringify({
                      type: "show_order_menu",
                    }),
                  },
                ],
              ],
            },
          }
        );
      }
      break;
    }
    case "confirm_order":
      bot.sendMessage(chat.id, `One ${data.order} coming your way.`);
      break;
    case "show_order_menu":
      sendOrderKeyboard(query.message);
      break;
  }
});

console.log("server up and running");
