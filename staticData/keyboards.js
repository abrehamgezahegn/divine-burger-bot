const { menuItems } = require("./menuItems");

const orderKeyboard = [
  [
    {
      text: menuItems[1].mealTitle.toLocaleUpperCase(),
      callback_data: JSON.stringify({
        type: "order",
        meal_id: 1,
      }),
    },
  ],
  [
    {
      text: menuItems[2].mealTitle.toLocaleUpperCase(),
      callback_data: JSON.stringify({
        type: "order",
        meal_id: 2,
      }),
    },
  ],
  [
    {
      text: menuItems[3].mealTitle.toLocaleUpperCase(),
      callback_data: JSON.stringify({
        type: "order",
        meal_id: 3,
      }),
    },
  ],
  [
    {
      text: menuItems[4].mealTitle.toLocaleUpperCase(),
      callback_data: JSON.stringify({
        type: "order",
        meal_id: 4,
      }),
    },
  ],
  [
    {
      text: menuItems[5].mealTitle.toLocaleUpperCase(),
      callback_data: JSON.stringify({
        type: "order",
        meal_id: 5,
      }),
    },
  ],
  [
    {
      text: menuItems[6].mealTitle.toLocaleUpperCase(),
      callback_data: JSON.stringify({
        type: "order",
        meal_id: 6,
      }),
    },
  ],
  [
    {
      text: menuItems[7].mealTitle.toLocaleUpperCase(),
      callback_data: JSON.stringify({
        type: "order",
        meal_id: 7,
      }),
    },
  ],
];

module.exports = {
  orderKeyboard,
};
