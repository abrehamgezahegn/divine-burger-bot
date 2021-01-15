const { getUser } = require("../user");
const { User } = require("../../schemas");

exports.emptyCart = async (msg) => {
  const user = await getUser(msg);
  await User.findByIdAndUpdate(user._id, { cart: [] });
};
