process.env.NTBA_FIX_319 = 1;
require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");

const token = process.env.BOT_TOKEN;
let bot;

if (process.env.NODE_ENV === "production") {
  bot = new TelegramBot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new TelegramBot(token, { polling: true });
}

const mongoose = require("mongoose");

const { menuItems } = require("./staticData/menuItems");
const { albumOne, albumTwo } = require("./staticData/gallery");
const { orderKeyboard } = require("./staticData/keyboards");
const { getRandomFreshPrinceGIF } = require("./utils/getRandomFreshPrinceGif");

const { User, Order } = require("./schemas");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Mongodb connected :)");
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
      remove_keyboard: true,
      keyboard: [
        [
          {
            text: "📍 Share my location",
            request_location: true,
          },
        ],
        ["🏠 Home", "◀️ Back to order"],
      ],
    },
  };

  bot.sendMessage(
    msg.chat.id,
    "Please share your location using the button in your keyboard.",
    locationOption
  );
};

const sendLocationOptions = (msg) => {
  bot.sendMessage(msg.chat.id, "Where should we deliver your order?", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📍 My location",
            callback_data: JSON.stringify({
              type: "share_location",
            }),
          },
        ],
        [
          {
            text: "🗺 Other location",
            callback_data: JSON.stringify({
              type: "accept_location_desc",
            }),
          },
        ],
        [
          {
            text: "🍔 At Divine",
            callback_data: JSON.stringify({
              type: "order_at_divine",
            }),
          },
        ],
        [
          {
            text: "🚗 I will come an pick up (Drive-Thru )",
            callback_data: JSON.stringify({
              type: "drive_thru_order",
            }),
          },
        ],
      ],
    },
  });
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
        ["Home", "Cancel"],
      ],
    },
  };

  bot.sendMessage(msg.chat.id, "How can we contact you?", contactOption);
};

const acceptLocationDesc = (msg) => {
  bot.sendMessage(msg.chat.id, "What's your location description?", {
    reply_markup: {
      force_reply: true,
    },
  });
};

const sendOrderConfirmation = async (msg) => {
  const users = await User.find().and({ chatId: msg.chat.id });
  const orders = await Order.find().and({ userChatId: msg.chat.id });
  const order = orders[orders.length - 1];
  const user = users[0];
  const meal = menuItems[order.mealId];

  let msgReplyMarkup = {};
  let locationReplyMarkup = {
    reply_markup: {
      one_time_keyboard: true,
      inline_keyboard: [
        [
          {
            text: "✅ Confirm Order",
            callback_data: JSON.stringify({
              type: "confirm_order",
            }),
          },
          {
            text: "🙊   Cancel",
            callback_data: JSON.stringify({
              type: "cancel_order",
            }),
          },
        ],
      ],
    },
  };
  if (!order.longitude) {
    msgReplyMarkup = locationReplyMarkup;
  }

  bot.sendMessage(
    msg.chat.id,
    `   \n\n\n\n🛵 Order confirmation 🛵 \n\n🍔 ${order.mealTitle} \n💰 ${meal.price}Birr  \n📱 ${user.phoneNumber} \n📍 ${order.address} \n\n`,
    msgReplyMarkup
  );

  if (order.latitude)
    setTimeout(() => {
      bot.sendLocation(
        msg.chat.id,
        order.latitude,
        order.longitude,
        locationReplyMarkup
      );
    }, 500);
};

const updateOrderLocation = async (msg, type = "coord", address = "") => {
  console.log("address", address);
  const orders = await Order.find().and({ userChatId: msg.chat.id });
  const order = orders[orders.length - 1];

  if (type === "coord") {
    await Order.findByIdAndUpdate(order._id, {
      longitude: msg.location.longitude,
      latitude: msg.location.latitude,
    });
  } else if (type === "address") {
    await Order.findByIdAndUpdate(order._id, {
      address,
    });
  }
};

const placeOrder = (msg) => {
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

      await Order.findByIdAndUpdate(order._id, {
        status: "Completed",
      });

      const getUserName = () => {
        const userName = msg.chat.username;
        if (userName) return `💬 @${userName}`;
        else return "";
      };

      const getHands = () => {
        if (order.longitude) return "👇👇👇";
        return "";
      };

      bot
        .sendMessage(
          process.env.TELEGRAM_GROUP_ID,
          `   \n\n\n\n🛵 New order 🛵 \n\n🍔 ${order.mealTitle} \n🧔 ${
            msg.chat.first_name
          } \n📱 ${user.phoneNumber} \n📍 ${
            order.address
          } \n${getUserName()} \n\n ${getHands()}`
        )
        .then(() => {
          if (order.longitude) {
            bot.sendLocation(
              process.env.TELEGRAM_GROUP_ID,
              order.latitude,
              order.longitude
            );
          }
        })
        .then(() => {
          bot.sendVideo(msg.chat.id, getRandomFreshPrinceGIF());
        })
        .then(() => {
          setTimeout(() => {
            bot.sendMessage(msg.chat.id, "Do you have another order?", {
              reply_markup: {
                one_time_keyboard: true,
                inline_keyboard: [
                  [
                    {
                      text: "Yes, show me some.",
                      callback_data: JSON.stringify({
                        type: "show_order_menu",
                      }),
                    },
                    {
                      text: "Nope",
                      callback_data: JSON.stringify({
                        type: "go_to_home",
                      }),
                    },
                  ],
                ],
              },
            });
          }, 1000);
        });
    });
};

bot.onText(/\/start/, (msg) => {
  sendHomeMenuKeyboard(msg);
});

bot.onText(/home/i, (msg) => {
  sendHomeMenuKeyboard(msg);
});

bot.onText(/menu/i, (msg) => {
  sendMenuPicture(msg);
});

bot.onText(/order/i, (msg) => {
  sendOrderKeyboard(msg);
});

bot.onText(/📍 Location/, (msg) => {
  sendLocation(msg);
});
bot.onText(/location/, (msg) => {
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
  if (msg.reply_to_message) {
    switch (msg.reply_to_message.text) {
      case "What's your location description?": {
        updateOrderLocation(msg, "address", msg.text);
        sendOrderConfirmation(msg);
        sendHomeMenuKeyboard(msg, "Almost there 😁!");
      }
    }
  }

  if (msg.text === "◀️ Back to order") {
    // sendOrderKeyboard(msg);
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
        status: "Incomplete",
      });
      await orderDb.save({ validateBeforeSave: true });

      const user = await User.find().and({ chatId: chat.id });

      if (user[0]) {
        sendLocationOptions(query.message);
      } else {
        sendContactPrompt(query.message);
      }
      break;
    case "share_location":
      sendLocationPrompt(query.message);
      break;
    case "accept_location_desc":
      acceptLocationDesc(query.message);
      break;
    case "order_at_divine":
      updateOrderLocation(query.message, "address", "At divine");
      sendOrderConfirmation(query.message);

      break;

    case "drive_thru_order":
      updateOrderLocation(query.message, "address", "Drive-thru");
      sendOrderConfirmation(query.message);

      break;

    case "confirm_order":
      placeOrder(query.message);
      break;

    case "show_order_menu":
      sendOrderKeyboard(query.message);
      break;

    case "go_to_home":
      sendHomeMenuKeyboard(query.message);
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
  updateOrderLocation(msg);
  acceptLocationDesc(msg);
});

console.log("server up and running");

const app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post("/" + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
