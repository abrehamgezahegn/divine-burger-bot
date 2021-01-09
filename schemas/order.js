const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  mealTitle: {
    type: String,
    required: true,
  },
  mealId: {
    type: Number,
    required: true,
  },
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
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
