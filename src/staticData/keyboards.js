const { menuItems } = require("./menuItems");

const orderKeyboard = [
  [
    {
      text: menuItems[1].mealTitle.toLocaleUpperCase() + "--------205Birr",
      callback_data: JSON.stringify({
        deleteKeyboard: true,

        type: "order",
        meal_id: 1,
      }),
    },
  ],
  [
    {
      text: menuItems[2].mealTitle.toLocaleUpperCase() + "--------186Birr",
      callback_data: JSON.stringify({
        deleteKeyboard: true,

        type: "order",
        meal_id: 2,
      }),
    },
  ],
  [
    {
      text: menuItems[3].mealTitle.toLocaleUpperCase() + "--------176Birr",
      callback_data: JSON.stringify({
        deleteKeyboard: true,

        type: "order",
        meal_id: 3,
      }),
    },
  ],
  [
    {
      text: menuItems[4].mealTitle.toLocaleUpperCase() + "--------150Birr",
      callback_data: JSON.stringify({
        deleteKeyboard: true,

        type: "order",
        meal_id: 4,
      }),
    },
  ],
  [
    {
      text: menuItems[5].mealTitle.toLocaleUpperCase() + "--------146Birr",
      callback_data: JSON.stringify({
        deleteKeyboard: true,

        type: "order",
        meal_id: 5,
      }),
    },
  ],
  [
    {
      text: menuItems[6].mealTitle.toLocaleUpperCase() + "--------120Birr",
      callback_data: JSON.stringify({
        deleteKeyboard: true,

        type: "order",
        meal_id: 6,
      }),
    },
  ],
  [
    {
      text: menuItems[7].mealTitle.toLocaleUpperCase() + "--------50Birr",
      callback_data: JSON.stringify({
        deleteKeyboard: true,

        type: "order",
        meal_id: 7,
      }),
    },
  ],
];

module.exports = {
  orderKeyboard,
};
