const { Order } = require("../../schemas");

exports.createOrder = async (msg) => {
  const orderDb = new Order({
    userChatId: msg.chat.id,
    status: "Incomplete",
  });
  await orderDb.save({ validateBeforeSave: true });
};
