const { body } = require("express-validator");


const titleValidation=body('postTitle').trim().escape()
const descriptionValidation=body('postDescription').trim().escape();
const contentValidation=body('postContent').escape().trim();





module.exports={titleValidation,descriptionValidation,contentValidation};