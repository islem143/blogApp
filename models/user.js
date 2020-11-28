'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      User.hasMany(models.Article,{foreignKey:'userId'});
      
    }
  };
  User.init({
    userName: DataTypes.STRING,
    email:DataTypes.STRING,
    resetToken:DataTypes.STRING,
    resetTokenExpiration:DataTypes.DATE,
    password:DataTypes.STRING
  
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};