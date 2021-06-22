process.env.NTBA_FIX_319 = 1;
require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { albumOne, albumTwo } = require("./staticData/gallery");

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

const token = process.env.BOT_TOKEN;
let bot;

if (process.env.NODE_ENV === "production") {
  bot = new TelegramBot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new TelegramBot(token, { polling: true });
}

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
    return;
  }

  switch (msg.text) {
    case "📖 Menu": {
      sendMenuPicture(bot, msg);
      break;
    }
    case "🍔 Order": {
      if (msg.chat.id < 0) {
        sendGroupOrderError(msg);
        return;
      }

      sendOrderKeyboard(bot, msg);
      break;
    }
    case "🛒 Cart": {
      showCart(bot, msg);
      break;
    }
    case "📍 Location": {
      sendLocation(bot, msg);
      break;
    }
    case "📷 Gallery": {
      sendGallery(msg);
      break;
    }
    case "📱 Contact": {
      sendContactInfo(msg);
      break;
    }
    case "🎖 Competitions": {
      sendCompetitions(msg);

      break;
    }
    case "🎇 Events": {
      sendEvents(msg);
      break;
    }

    case "Want a bot like this?": {
      sendDeveloperContact(msg);
      break;
    }
  }
});

initCallbackQuery(bot);
initLocationListener(bot);
initContactListener(bot);

const app = express();

app.use(bodyParser.json());

const listener = app.listen(process.env.PORT, () => {
  console.log("listening on:", listener.address().port);
});

app.get("/", (req, res) => {
  res.send("Sever is up");
});

app.post("/" + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

console.log("server up and running");
