const model = require("../models/index");
const Util = require("./Util");
const { validationResult } = require("express-validator");
exports.getAddArticle = async (req, res, next) => {
  let inEditing = req.query.edit;
  let info = req.flash("info");
  info = Util.checkMessage(info);
  try {
    let categories = await model.Category.findAll();
    if (inEditing) {
      let articleId = req.params.articleId;
      let article = await model.Article.findByPk(articleId);
      let values = {
        article,
        editMode: inEditing,
        info,
        message: "",
        categories,
      };
      return res.render("./Admin/AddArticle", values);
    } else {
      let values = { editMode: inEditing, info, message: "", categories };
      return res.render("./Admin/AddArticle", values);
    }
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};

exports.postAddArticle = async (req, res, next) => {
  let {
    postTitle,
    postDescription,
    postContent,
    categoryId: categoriesId,
  } = req.body;
  const postImage = req.file;
  if (!postImage) {
    return res.status(422).render("Admin/AddArticle", {
      message: "file attached is not an image",
      article: {
        title: postTitle,
        description: postDescription,
        content: postContent,
      },
      editMode: "",
      info: "",
    });
  }
  const imageUrl = postImage.path;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("Admin/AddArticle", {
      message: errors.array()[0].msg,
      article: {
        title: postTitle,
        description: postDescription,
        content: postContent,
      },
      editMode: "",
      info: "",
    });
  }
  const user = req.user;
  try {
    let article = await model.Article.create({
      title: postTitle,
      imageUrl,
      description: postDescription,
      content: postContent,
      userId: user.id,
    });
    await article.addCategories(categoriesId);
    req.flash("info", "Article Added");
    res.redirect("/Admin/AddArticle");
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};
exports.postEditArticle = async (req, res, next) => {
  const userId = req.user.id;
  let { postTitle, postDescription, postContent, articleId,categoryId } = req.body;
  const postImage = req.file;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render(`./Admin/AddArticle`, {
      message: errors.array()[0].msg,
      article: {
        id: articleId,
        title: postTitle,
        description: postDescription,
        content: postContent,
      },
      editMode: true,
      info: "",
    });
  }
  try {
    let article = await model.Article.findByPk(articleId);
    if (article.userId != userId) {
      req.flash("info", "Action Failed");
      return res.redirect("/Admin/AddArticle");
    }
    const imageUrl = postImage.path;
    console.log(imageUrl);
    
    if (!imageUrl) {
      await article.update({
        title: postTitle,
        description: postDescription,
        content: postContent,
      });
    }
    Util.deleteFile(imageUrl);
    await article.update({
      title: postTitle,
      imageUrl,
      description: postDescription,
      content: postContent,
    });
    await article.addCategories(categoryId);
    req.flash("info", "Article Edited");
    res.redirect("/Admin/MyArticles");
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};
exports.getMyArticles = async (req, res, next) => {
  let userId = req.user.id;
  let info = req.flash("info");
  info = Util.checkMessage(info);
  try {
    let myArticles = await model.Article.findAll({ where: { userId } });
    let values = { articles: myArticles, info };
    res.render("./Admin/MyArticles", values);
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};

exports.postDeleteArticle = async (req, res, next) => {
  const articleId = req.params.articleId;
  const userId = req.user.id;
  try {
    let article = await model.Article.findByPk(articleId);
    if (article.userId != userId) {
      return res.redirect("/Admin/MyArticles");
    }
    await Util.deleteFile(article.imageUrl);
    await article.destroy();
    res.status(200).json({ message: "articleDeleted" });
  } catch (err) {
    res.status(500).json({ message: "delete product failed" });
    const error = new Error(err);
    next(error);
    return error;
  }
};
