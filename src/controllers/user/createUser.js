const { User } = require("../../schemas");

exports.createUser = async (msg, cart = []) => {
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
