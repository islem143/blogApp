'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id:{
        primaryKey:true, 
        type:Sequelize.INTEGER,
        autoIncrement:true
        },
        userName:{
          type:Sequelize.STRING,
          allowNull:false
        },
        email:{
          type:Sequelize.STRING,
          allowNull:false
        },
        resetToken:Sequelize.STRING,
        resetTokenExpiration:Sequelize.DATE,
        password:{
        type:Sequelize.STRING,
        allowNull:false
        },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
      
    });

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};