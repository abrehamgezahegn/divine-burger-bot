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
const { albumOne, albumTwo, outsideView } = require("./staticData/gallery");
const { orderKeyboard } = require("./staticData/keyboards");
const { getRandomFreshPrinceGIF } = require("./utils/getRandomFreshPrinceGif");

const { User, Order } = require("./schemas");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
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
        ["🛒 Cart"],
        ["📍 Location"],
        ["📷 Gallery", "📱 Contact"],
        ["🎖 Competitions", "🎇 Events"],
        ["Want a bot like this?"],
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
    "https://res.cloudinary.com/de5awe7fs/image/upload/v1609099462/Divine/photo_2020-12-27_23-04-10.jpg",

    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🍔 Order",
              callback_data: JSON.stringify({
                type: "show_order_menu",
              }),
            },
          ],
        ],
      },
    }
  );
};

const sendLocation = (msg) => {
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

const sendCompetitions = (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "No upcoming or ongoing competitions for now :(. Stay tuned"
  );
};

const sendEvents = (msg) => {
  bot.sendMessage(msg.chat.id, "No upcoming or ongoing events for now :(.");
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
  setTimeout(() => {
    sendDeveloperContact(msg);
  }, 1000);
};

const sendDeveloperContact = (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🧑‍💻 Developer Contact \n\n👨‍🦰 Abreham Gezahegn \n📱 +251913616046 \ngithub: abrehamgezahegn"
  );
};

const sendOutsideView = (msg) => {
  bot.sendMediaGroup(msg.chat.id, outsideView);
};

const sendGroupOrderError = (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Sorry we don't accept orders from a group chat. Please head over @divineburger_bot to order."
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

const createUser = async (msg, cart = []) => {
  const users = await User.find().and({ chatId: msg.chat.id });
  const user = users[0];
  if (user) {
    return;
  }

  const userDb = new User({
    firstName: msg.chat.first_name,
    userName: msg.chat.username || "NO_USER_NAME",
    chatId: msg.chat.id,
    cart,
  });
  const newUser = await userDb.save({ validateBeforeSave: true });
  return newUser;
};

const getUser = async (msg) => {
  const users = await User.find().and({ chatId: msg.chat.id });
  const user = users[0];
  if (!user) {
    return createUser(msg);
  }
  return user;
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
    one_time_keyboard: true,
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        [
          {
            text: "📱 My phone number",
            request_contact: true,
          },
        ],
        ["🏠 Back to home", "◀️ Back to order"],
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

const addItemToCart = async (msg, meal) => {
  const user = await getUser(msg);
  const item = {
    mealTitle: meal.mealTitle,
    mealId: meal.mealId,
    price: meal.price,
  };

  if (!user) {
    createUser(msg, [item]);
    return;
  }

  const cart = [...user.cart, item];

  await User.findByIdAndUpdate(user._id, { cart });
};

const removeItemFromCart = async (msg, cartItemIndex) => {
  const user = await getUser(msg);
  const item = user.cart[cartItemIndex];

  if (user.cart.length === 0) {
    bot.sendMessage(
      msg.chat.id,
      `You have already removed that item from your cart`,
      { parse_mode: "Markdown" }
    );
    return;
  }

  const filtered = user.cart.filter((_, index) => index !== cartItemIndex);
  await User.findByIdAndUpdate(user._id, { cart: filtered });
  bot.sendMessage(
    msg.chat.id,
    `*${item.mealTitle}* has been removed from your cart`,
    { parse_mode: "Markdown" }
  );

  if (filtered.length > 0) showCart(msg);
};

const emptyCart = async (msg) => {
  const user = await getUser(msg);
  await User.findByIdAndUpdate(user._id, { cart: [] });
};

const generateOrderDetails = (user) => {
  let message = ``;
  let mealPrice = 0;
  const takeawayCharge = user.cart.length * 10;

  user.cart.forEach((item, index) => {
    mealPrice = mealPrice + item.price;
    const text = `🍔 1 ${item.mealTitle} \n💰 ${item.price}Birr \n`;

    message = message.concat(text);
    if (index < user.cart.length - 1)
      message = message.concat(`---------------------\n`);
  });
  message = message.concat(`------------------------------------\n\n`);

  message = message.concat(`Total = ${mealPrice}Birr \n`);
  message = message.concat(`Takeaway charge = ${takeawayCharge}Birr \n`);
  message = message.concat(`Delivery rate = 10birr/km \n`);
  message = message.concat(
    `*Grand total = ${mealPrice + takeawayCharge}Birr + delivery fee*`
  );

  return message;
};

const showCart = async (msg) => {
  const user = await getUser(msg);

  if (user.cart.length === 0) {
    bot.sendMessage(
      msg.chat.id,
      "Your cart is empty. Go to orders to add items."
    );
    return;
  }

  const title = `*Your cart 🛒*\n\n`;
  const messageBody = generateOrderDetails(user);
  const message = title + messageBody;

  let keyboardItems = [];
  user.cart.forEach((item, index) => {
    const keyboardItem = {
      text: `${item.mealTitle} ❌`,
      callback_data: JSON.stringify({
        type: "remove_cart_item",
        cartItemIndex: index,
      }),
    };
    keyboardItems.push([keyboardItem]);
  });

  let cartKeyboard = {
    parse_mode: "Markdown",

    reply_markup: {
      one_time_keyboard: true,
      inline_keyboard: [
        ...keyboardItems,
        [
          {
            text: "✅ Place Order",
            callback_data: JSON.stringify({
              type: "place_order",
            }),
          },
          {
            text: "🍔 Order more",
            callback_data: JSON.stringify({
              type: "show_order_menu",
            }),
          },
        ],
      ],
    },
  };

  bot.sendMessage(msg.chat.id, message, cartKeyboard);
};

const sendItemAddedMessage = (msg, mealTitle) => {
  const cartOptions = {
    parse_mode: "Markdown",
    reply_markup: {
      one_time_keyboard: true,
      inline_keyboard: [
        [
          {
            text: "🛒 Show cart",
            callback_data: JSON.stringify({
              type: "show_cart",
            }),
          },
          {
            text: "🍔 Order more",
            callback_data: JSON.stringify({
              type: "show_order_menu",
            }),
          },
        ],
      ],
    },
  };

  bot.sendMessage(
    msg.chat.id,
    `1 *${mealTitle}* added to your cart 🚀. You can checkout or add more items to your cart`,
    cartOptions
  );
};

const sendOrderConfirmation = async (msg) => {
  const user = await getUser(msg);
  const orders = await Order.find().and({ userChatId: msg.chat.id });
  const order = orders[orders.length - 1];

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
        ],
      ],
    },
  };
  if (!order.longitude) {
    msgReplyMarkup = locationReplyMarkup;
  }

  bot.sendMessage(
    msg.chat.id,
    `   \n\n\n\n🛵 Delivery details 🛵 \n📱 ${user.phoneNumber} \n📍 ${order.address} \n\n`,
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

const confirmOrder = (msg) => {
  bot
    .sendMessage(
      msg.chat.id,
      `Thank you ${msg.chat.first_name} 😁. Your order is through 🎊🎊🎊.`
    )
    .then(async () => {
      const orders = await Order.find().and({ userChatId: msg.chat.id });
      const order = orders[orders.length - 1];
      const user = await getUser(msg);

      await Order.findByIdAndUpdate(order._id, {
        status: "Pending",
        cart: user.cart,
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

      const orderDetail = generateOrderDetails(user);
      bot
        .sendMessage(
          process.env.TELEGRAM_GROUP_ID,
          `   \n\n\n\n🛵 New order 🛵 \n\n${orderDetail} \n\n🧔 ${
            msg.chat.first_name
          } \n📱 ${user.phoneNumber} \n📍 ${
            order.address
          } \n${getUserName()} \n\n ${getHands()}`
        )
        .then(() => {
          emptyCart(msg);
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
                      text: "Yes",
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
  createUser(msg);
  sendHomeMenuKeyboard(msg);
});

bot.onText(/home/i, (msg) => {
  sendHomeMenuKeyboard(msg);
});

bot.onText(/menu/i, (msg) => {
  sendMenuPicture(msg);
});

bot.onText(/order/i, (msg) => {
  if (msg.chat.id < 0) {
    sendGroupOrderError(msg);
    return;
  }

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

bot.onText(/events/gi, (msg) => {
  sendEvents(msg);
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

  if (msg.text === "🛒 Cart") {
    showCart(msg);
  }

  if (msg.text === "◀️ Back to order") {
    // sendOrderKeyboard(msg);
  }
  if (msg.text === "Want a bot like this?") {
    sendDeveloperContact(msg);
  }
});

bot.on("callback_query", async (query) => {
  const data = JSON.parse(query.data);
  const chat = query.message.chat;

  switch (data.type) {
    case "order": {
      bot.sendPhoto(chat.id, menuItems[data.meal_id].cover, {
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
      break;
    }
    case "place_order":
      const orderDb = new Order({
        userChatId: chat.id,
        status: "Incomplete",
      });
      await orderDb.save({ validateBeforeSave: true });

      const user = await User.find().and({ chatId: chat.id });

      if (user[0].cart.length === 0) {
        bot.sendMessage(
          query.message.chat.id,
          "Your cart is empty. Go to orders to add items."
        );
        break;
      }

      if (user[0].phoneNumber) {
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
    case "add_to_cart":
      const { mealTitle, mealId, price } = menuItems[data.meal_id];
      addItemToCart(query.message, { mealTitle, mealId, price });
      sendItemAddedMessage(query.message, mealTitle);
      break;

    case "remove_cart_item":
      removeItemFromCart(query.message, data.cartItemIndex);
      break;
    case "empty_cart":
      emptyCart(query.message);
      bot.sendMessage(query.message.chat.id, `Your cart has been emptied.`, {
        parse_mode: "Markdown",
      });
      break;
    case "show_cart":
      showCart(query.message);
      break;

    case "confirm_order":
      confirmOrder(query.message);
      break;

    case "show_order_menu":
      sendOrderKeyboard(query.message);
      break;
    case "send_outside_view":
      sendOutsideView(query.message);
      break;

    case "go_to_home":
      sendHomeMenuKeyboard(query.message);
      break;
  }
});

bot.on("contact", async (msg) => {
  const user = await getUser(msg);
  await User.findByIdAndUpdate(user._id, {
    phoneNumber: msg.contact.phone_number,
  });
  sendLocationOptions(msg);
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
