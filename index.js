process.env.NTBA_FIX_319 = 1;
require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const mongoose = require("mongoose");

const { menuItems } = require("./staticData/menuItems");
const { albumOne, albumTwo } = require("./staticData/gallery");
const { orderKeyboard } = require("./staticData/keyboards");

const { User, Order } = require("./schemas");

mongoose.connect("mongodb://localhost/divine", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  // we're connected!
});

const sendHomeMenuKeyboard = (
  msg,
  message = "Welcome to Divine burger, you seem hungry 🤔"
) => {
  bot.sendMessage(msg.chat.id, message, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        ["📖 Menu"],
        ["🍔 Order"],
        ["📍 Location"],
        ["📷 Gallery", "📱 Contact"],
        ["🎖 Competitions", "💸 Deals and Discounts"],
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

const sendContactInfo = (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🍔 Divine Burger 🧑‍🍳\n\n ☎️ +251965966465 \nig: @divineburger_ \ntwitter: @divineburger_  \n\n Feel free to contact us 😁."
  );
};

const sendLocationPrompt = (msg) => {
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

  bot.sendMessage(
    msg.chat.id,
    "Where should we deliver your order?",
    locationOption
  );
};

const sendContactPrompt = (msg) => {
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

  bot.sendMessage(msg.chat.id, "How can we contact you?", contactOption);
};

bot.onText(/\/start/, (msg) => {
  sendHomeMenuKeyboard(msg);
});

bot.onText(/menu/i, (msg) => {
  sendMenuPicture(msg);
});

bot.onText(/order/i, (msg) => {
  sendOrderKeyboard(msg);
});

bot.onText(/location/i, (msg) => {
  sendLocation(msg);
});

bot.onText(/gallery/i, (msg) => {
  sendGallery(msg);
});

bot.onText(/competitions/i, (msg) => {
  sendCompetitions(msg);
});

bot.onText(/deals and discounts/gi, (msg) => {
  sendDealsAndDiscounts(msg);
});

bot.onText(/contact/i, (msg) => {
  sendContactInfo(msg);
});

bot.on("message", (msg) => {
  if (msg.text === "Home") {
    sendHomeMenuKeyboard(msg);
  }
  if (msg.text === "Cancel") {
    sendOrderKeyboard(msg);
  }
});

bot.on("callback_query", async (query) => {
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
      const meal = menuItems[data.meal_id];

      const orderDb = new Order({
        mealTitle: meal.mealTitle,
        mealId: meal.mealId,
        userChatId: chat.id,
      });
      await orderDb.save({ validateBeforeSave: true });

      const user = await User.find().and({ chatId: chat.id });

      if (user[0]) {
        sendLocationPrompt(query.message);
      } else {
        sendContactPrompt(query.message);
      }

      break;
    case "show_order_menu":
      sendOrderKeyboard(query.message);
      break;
  }
});

bot.on("contact", async (msg) => {
  const userDb = new User({
    firstName: msg.chat.first_name,
    userName: msg.chat.username || "NO_USER_NAME",
    phoneNumber: msg.contact.phone_number,
    chatId: msg.chat.id,
  });
  await userDb.save({ validateBeforeSave: true });

  sendLocationPrompt(msg);
});

bot.on("location", async (msg) => {
  bot
    .sendMessage(
      msg.chat.id,
      `Thank you ${msg.chat.first_name} 😁. Your order is through 🎊🎊🎊.`
    )
    .then(async () => {
      const users = await User.find().and({ chatId: msg.chat.id });
      const orders = await Order.find().and({ userChatId: msg.chat.id });
      const order = orders[orders.length - 1];
      const user = users[0];

      const getUserName = () => {
        const userName = msg.chat.username;
        if (userName) return `💬 @${userName}`;
        else return "";
      };

      bot
        .sendMessage(
          process.env.GROUP_ID,
          `   \n\n\n\n🛵 New order 🛵 \n\n🍔 ${order.mealTitle} \n🧔 ${
            msg.chat.first_name
          } \n📱 ${user.phoneNumber} \n${getUserName()} \n\n 👇👇👇`
        )
        .then(() => {
          bot.sendLocation(
            process.env.GROUP_ID,
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
          sendHomeMenuKeyboard(msg, "Do you have another order?");
        });
    });
});

console.log("server up and running");
