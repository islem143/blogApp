"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    let users = [];
    for (let i = 0; i < 1000; i++) {
      let obj = {
        userName: "islem",
        email: "example@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        password: "132",
      };
      users.push(obj);
    }

    return queryInterface.bulkInsert("Users", users);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
