'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    
    static associate(models) {
      Article.belongsTo(models.User,{foreignKey:'userId'});
      Article.hasMany(models.Comment,{foreignKey:"articleId"});
      Article.belongsToMany(models.Category,{through:'articleCategory'});
    }

  };
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};