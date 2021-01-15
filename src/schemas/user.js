const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  mealTitle: {
    type: String,
    required: true,
  },
  mealId: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  userName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  chatId: {
    type: String,
    required: true,
  },
  cart: [menuItemSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = { User, menuItemSchema };
