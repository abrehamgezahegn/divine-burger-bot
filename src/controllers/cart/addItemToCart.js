const { User } = require("../../schemas");
const { getUser, createUser } = require("../user");

exports.addItemToCart = async (msg, meal) => {
  const user = await getUser(msg);
  const item = {
    mealTitle: meal.mealTitle,
    mealId: meal.mealId,
    price: meal.price,
  };

  if (!user) {
    createUser(msg, [item]);
    return;
  }

  const cart = [...user.cart, item];

  await User.findByIdAndUpdate(user._id, { cart });
};
