const { User } = require("../../schemas");
const { createUser } = require("./createUser");

exports.getUser = async (msg) => {
  const users = await User.find().and({ chatId: msg.chat.id });
  const user = users[0];
  if (!user) {
    return createUser(msg);
  }
  return user;
};
