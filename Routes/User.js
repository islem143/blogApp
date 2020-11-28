const express=require('express');
const userControllers = require('../Controllers/User');

const Router=express.Router();



Router.get('/',userControllers.getHomePage)
Router.post('/Categories',userControllers.getCategories)
Router.get('/CategoryPage',userControllers.getCategoryPage);
Router.get('/Article/:articleId',userControllers.getOneArticle);
Router.post('/Articles',userControllers.getArticles)
Router.post('/AddComment',userControllers.postComment);









module.exports=Router;