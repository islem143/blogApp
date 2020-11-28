const { body } = require("express-validator");
const models=require('../../models/index')
const userNameCheck = body("userName").escape().trim().custom((value, { req }) => {
  const userReg = /^[a-z]([0-9][0-9]+[a-z]*|[a-z]+\d*)$/;
  if (!userReg.test(value)) {
    throw new Error(
      "username should be a least 2 char of alphabet! and containes numbers at the end!"
    );
  }
  return models.User.findOne({ where: { userName:value } }).then(
    (user) => {
      if (user) {
        return Promise.reject("user Already exists");
      }
    }
  );
});
let emailNotFound=body('email').escape().isEmail()
.withMessage("please enter a valide email").custom((value,{req})=>{
  return models.User.findOne({ where: { email:value } }).then((user) => {
    if (!user) {
      return Promise.reject("email  exists not");
    }
  });
})
const emailCheck = body("email").escape()
  .isEmail()
  .withMessage("please enter a valide email")
  .custom((value, { req }) => {
    return models.User.findOne({ where: { email:value } }).then((user) => {
      if (user) {
        return Promise.reject("email already exists");
      }
    });
  });
const passwordCheck = body("password").escape().trim().custom((value) => {
  const passwordCheck = /^[A-Z](?=.{6,})(?=.*\d+)(?=\w*[a-zA-z]+)/;
  if (!passwordCheck.test(value)) {
    throw new Error(
      "password should start With Cap letter and containes a least 6 characters of numbers and alphabet  "
    );
  }
  return true;
});
const confirmPassowrd = body("confirmPassword").escape().trim().custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error("no matching password");
  }
  return true;
});






module.exports = { userNameCheck,emailNotFound,emailCheck, passwordCheck, confirmPassowrd};
