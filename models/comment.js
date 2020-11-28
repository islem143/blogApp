'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
   
    
    static associate(models) {
      Comment.belongsTo(models.Article,{foreignKey:"articleId"});
    }
  };
  Comment.init({
    content: DataTypes.STRING,
    name:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};