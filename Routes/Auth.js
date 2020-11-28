const express = require("express");
const Router = express.Router();
const AuthControlleres = require("../Controllers/Auth");

const authValidation = require("./validation/authValidation");

Router.get("/LogIn", AuthControlleres.getLogIn);
Router.get("/SignUp", AuthControlleres.getSignUp);
Router.get("/Reset", AuthControlleres.getReset);
Router.get("/Reset/:token", AuthControlleres.getNewPassword);
// body('email').isEmail().withMessage("please enter a valide email");
//
Router.post("/LogIn", [authValidation.emailNotFound], AuthControlleres.postLogIn);
Router.post(
  "/SignUp",
  [
    authValidation.userNameCheck,
    authValidation.emailCheck,
    authValidation.passwordCheck,
    authValidation.confirmPassowrd,
  ],
  AuthControlleres.postSignUp
);
Router.post("/LogOut", AuthControlleres.postLogOut);
Router.post("/Reset", AuthControlleres.postReset);

Router.post("/NewPassword", AuthControlleres.postNewPassword);

module.exports = Router;
