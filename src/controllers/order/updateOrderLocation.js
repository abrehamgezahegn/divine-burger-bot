const { Order } = require("../../schemas");

exports.updateOrderLocation = async (msg, type = "coord", address = "") => {
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
