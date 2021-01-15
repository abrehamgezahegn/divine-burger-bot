exports.generateOrderDetails = (user) => {
  let message = ``;
  let mealPrice = 0;
  const takeawayCharge = user.cart.length * 10;

  user.cart.forEach((item, index) => {
    mealPrice = mealPrice + item.price;
    const text = `🍔 1 ${item.mealTitle} \n💰 ${item.price}Birr \n`;

    message = message.concat(text);
    if (index < user.cart.length - 1)
      message = message.concat(`---------------------\n`);
  });
  message = message.concat(`------------------------------------\n\n`);

  message = message.concat(`Total = ${mealPrice}Birr \n`);
  message = message.concat(`Takeaway charge = ${takeawayCharge}Birr \n`);
  message = message.concat(`Delivery rate = 10birr/km \n`);
  message = message.concat(
    `*Grand total = ${mealPrice + takeawayCharge}Birr + delivery fee*`
  );

  return message;
};
