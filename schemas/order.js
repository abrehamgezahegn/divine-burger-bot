const mongoose = require("mongoose");
const { menuItemSchema } = require("./user");

const orderSchema = new mongoose.Schema({
  userChatId: {
    type: String,
    res: "User",
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  address: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Incomplete", "Pending", "Delivered"],
  },
  cart: [menuItemSchema],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
