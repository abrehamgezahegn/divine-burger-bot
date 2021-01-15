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

const { albumOne, albumTwo } = require("./staticData/gallery");

const { User } = require("./schemas");

const { sendMenuPicture } = require("./controllers/menu/sendMenuPicture");
const {
  sendOrderKeyboard,
  sendOrderConfirmation,
  updateOrderLocation,
} = require("./controllers/order");
const { createUser } = require("./controllers/user");
const { showCart } = require("./controllers/cart");
const { sendLocation } = require("./controllers/location");

const { sendHomeMenuKeyboard } = require("./controllers/home");

const {
  initCallbackQuery,
  initContactListener,
  initLocationListener,
} = require("./events");

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

const sendGroupOrderError = (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Sorry we don't accept orders from a group chat. Please head over @divineburger_bot to order."
  );
};

bot.onText(/\/start/, (msg) => {
  createUser(msg);
  sendHomeMenuKeyboard(bot, msg);
});

bot.onText(/home/i, (msg) => {
  sendHomeMenuKeyboard(bot, msg);
});

bot.onText(/menu/i, (msg) => {
  sendMenuPicture(bot, msg);
});

bot.onText(/order/i, (msg) => {
  if (msg.chat.id < 0) {
    sendGroupOrderError(msg);
    return;
  }

  sendOrderKeyboard(bot, msg);
});

bot.onText(/📍 Location/, (msg) => {
  sendLocation(bot, msg);
});
bot.onText(/location/, (msg) => {
  sendLocation(bot, msg);
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
        sendOrderConfirmation(bot, msg);
        sendHomeMenuKeyboard(bot, msg, "Almost there 😁!");
        break;
      }
    }
  }

  if (msg.text === "🛒 Cart") {
    showCart(bot, msg);
  }

  if (msg.text === "◀️ Back to order") {
    // sendOrderKeyboard(bot, msg);
  }
  if (msg.text === "Want a bot like this?") {
    sendDeveloperContact(msg);
  }
});

initCallbackQuery(bot);
initLocationListener(bot);
initContactListener(bot);

const app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post("/" + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

console.log("server up and running");
