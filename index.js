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
            text: "whaa",
            callback_data: JSON.stringify({
              query: "menu",
            }),
            url:
              "https://www.google.com/maps/place/Divine+Burger/@8.9987837,38.7831049,17z/data=!3m1!4b1!4m5!3m4!1s0x164b859bbc283e9b:0xe2840693f0f71555!8m2!3d8.9987784!4d38.7852989",
            // pay: true,
          },
        ],
      ],
      // keyboard: [
      //   [" Divine special  💸205"],
      //   ["Junkie 💸90"],
      //   ["Pestramininin 💸87"],
      //   [" Chicken special  💸180"],
      //   ["Home"],
      // ],
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
        "https://res.cloudinary.com/de5awe7fs/image/upload/v1609099199/Divine/photo_2020-12-27_00-07-06.jpg",
    },
    {
      type: "photo",
      media:
        "https://drive.google.com/file/d/1N1CXO_yZG3E9WxV80Gew7skB430pDSOS/view?usp=sharing",
    },
    {
      type: "photo",
      media:
        "https://drive.google.com/file/d/15G_1dgDqKqo_StF4GAFvLkCTJ952sPBX/view?usp=sharing",
    },
    {
      type: "photo",
      media:
        "https://drive.google.com/file/d/1X2MNkmjFGglXBPZl9tmzIjSXwHCAPQpf/view?usp=sharing",
    },

    {
      type: "photo",
      media:
        "https://drive.google.com/file/d/1ACrwd5MOCytWU_5q9XibtbYed1aI1nmR/view?usp=sharing",
    },
    {
      type: "video",
      media:
        "https://res.cloudinary.com/de5awe7fs/video/upload/v1609099249/Divine/IMG_4182.mp4",
    },
    {
      type: "photo",
      media:
        "https://drive.google.com/file/d/1rO__cjh5Ng9HAjtIZu3lgxm2X-zq9IBX/view?usp=sharing",
    },
    {
      type: "photo",
      media:
        "https://drive.google.com/file/d/1iw9IGEwHgKQvuT30iJR5aqEulxmdz-TW/view?usp=sharing",
    },
  ]);
};

bot.onText(/\/start/, (msg) => {
  sendHomeMenuKeyboard(msg);
});

bot.on("message", (msg) => {
  console.log("msg", msg);
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

console.log("server up and running");
