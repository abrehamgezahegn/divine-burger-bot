const { User } = require("../schemas");
const { getUser } = require("../controllers/user");
const { sendLocationPrompt } = require("../controllers/location");

exports.initContactListener = (bot) => {
  bot.on("contact", async (msg) => {
    const user = await getUser(msg);
    await User.findByIdAndUpdate(user._id, {
      phoneNumber: msg.contact.phone_number,
    });
    sendLocationOptions(bot, msg);
  });
};
