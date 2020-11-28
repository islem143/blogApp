const models = require("../models/index");
const ARTICLES_PER_PAGE = 4;
exports.getHomePage = async (req, res, next) => {
  try {
    let nbrArticles = await models.Article.count();
    let nbrLinks = Math.ceil(nbrArticles / 4);
    res.render("./User/Home", { nbrLinks });
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};

async function getLinkEnd(page, nbrArticles) {
  let linksEnd;
  let nbrLinks;
  try {
    if (nbrArticles <= 0) {
      return 0;
    }
    nbrLinks = Math.ceil(nbrArticles / 4);
    if (page > nbrLinks) {
      return;
    }
    if (page == 2 || page == 1) {
      linksEnd = nbrLinks < 5 ? nbrLinks : 5;
    } else if (page <= 0) {
      return;
    } else if (page + 2 <= nbrLinks) {
      linksEnd = page + 2;
    } else {
      linksEnd = nbrLinks;
    }
    return { linksEnd, nbrLinks };
  } catch (err) {
    const error = new Error(err);
    return error;
  }
}

exports.getArticles = async (req, res, next) => {
  let page = req.body.page || 1;
  let linksEnd;
  try {
    let nbrArticles = await models.Article.count();
    let nbrLinks = Math.ceil(nbrArticles / 4);
    if (page > nbrLinks) {
      return;
    }
    if (page == 2 || page == 1) {
      linksEnd = nbrLinks < 5 ? nbrLinks : 5;
    } else if (page <= 0) {
      return;
    } else if (page + 2 <= nbrLinks) {
      linksEnd = page + 2;
    } else {
      linksEnd = nbrLinks;
    }
    let articles = await models.Article.findAll({
      offset: page * ARTICLES_PER_PAGE - 4,
      limit: 4,
    });
    if (!articles) {
      res.json({ message: "articles not found" });
    }
    res.status(200).json({ articles, linksEnd, nbrLinks });
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};

exports.getCategories = async (req, res, next) => {
  let catName = req.body.catName;
  let page = req.body.page || 1;
  let nbrArticles;
  try {
    let articles;
    if (catName == "all") {
      articles = await models.Article.findAll({
        offset: page * ARTICLES_PER_PAGE - 4,
        limit: 4,
      });
      nbrArticles = await models.Article.count();
      let { linksEnd, nbrLinks } = await getLinkEnd(page, nbrArticles);

      if (articles) {
        return res.status(200).json({ articles, linksEnd, nbrLinks });
      }
      throw new Error("cannot get articles");
    } else {
      [categories] = await models.Category.findAll({
        where: { name: catName },
      });
      if (!categories) {
        throw new Error("cannot get categoreis ");
      }
      let catArticles = await categories.getArticles();
      let articles = await categories.getArticles({
        offset: page * ARTICLES_PER_PAGE - 4,
        limit: 4,
      });
      let nbrArticles = catArticles.length;
      
      let { linksEnd, nbrLinks } = await getLinkEnd(page, nbrArticles);
      if (!articles) {
        throw new Error("cannot get articles");
      }
      res.status(200).json({ articles, linksEnd, nbrLinks });
    }
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};
exports.getCategoryPage = async (req, res, next) => {
  try {
    let categories = await models.Category.findAll();
    res.render("./User/Categories", { categories });
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};

exports.getOneArticle = async (req, res, next) => {
  const articleId = req.params.articleId;
  let user = req.user;
  try {
    let article = await models.Article.findOne({
      where: {
        id: articleId,
      },
      include: models.User,
    });
    if (!article) {
      throw new Error("article not found");
    }
    let categories = await article.getCategories({ raw: true });
    if (!categories) {
      throw new Error("categoreis not found");
    }
    let comments = await models.Comment.findAll({
      where: { articleId },
    });
    if (!comments) {
      throw new Error("comments not found");
    }

    let values = { article, comments, categories, user };
    res.render("./User/Article", values);
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};

exports.postComment = async (req, res, next) => {
  const { content: commentContent, articleId, name } = req.body;
  try {
    if (!req.user) {
      await models.Comment.create({ content: commentContent, articleId, name });
    } else {
      await models.Comment.create({ content: commentContent, articleId, name });
    }
    res.redirect(`/Article/${articleId}`);
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};
