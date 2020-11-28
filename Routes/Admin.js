const express = require("express");
const Router = express.Router();
const isAuth = require("../middleware/isAuth");
const adminControllers = require("../Controllers/Admin");
const multer=require('multer')
const fileStorage=require('./fileStrorage');




const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'images');
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+"."+file.originalname);
  }
})
const fileFilter=(req,file,cb)=>{
if(file.mimetype==="image/png"||file.mimetype==="image/jpg"||file.mimetype==="image/jpeg"){
  cb(null,true)
}else{
  cb(null,false)
}
}
const upload=multer({storage,fileFilter})
const articleValidation = require("./validation/articleValidation");

Router.get("/AddArticle", isAuth, adminControllers.getAddArticle);
Router.get("/AddArticle/:articleId", isAuth, adminControllers.getAddArticle);
Router.get("/MyArticles", isAuth, adminControllers.getMyArticles);


Router.post(
  "/AddArticle",
  isAuth,
  [
    articleValidation.titleValidation,
    articleValidation.descriptionValidation,
    articleValidation.contentValidation,
  ],
  fileStorage.upload.single('postImage'),
  adminControllers.postAddArticle
);
Router.post("/EditArticle",[
  articleValidation.titleValidation,
  articleValidation.descriptionValidation,
  articleValidation.contentValidation,
], isAuth,upload.single('postImage'), adminControllers.postEditArticle);

Router.delete(
  "/DeleteArticle/:articleId",
  isAuth,
  adminControllers.postDeleteArticle
);

module.exports = Router;
