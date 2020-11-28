const sequelize = require("sequelize");
const Util = require("./Util");
const bcrypt = require("bcryptjs");
const models=require('../models/index')
const { validationResult } = require("express-validator");
exports.getLogIn = (req, res) => {
  let message = req.flash("message");
  message = Util.checkMessage(message);
  res.render("Auth/LogIn", {
    message,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.postLogIn = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("Auth/LogIn", {
      message: errors.array()[0].msg,
      oldInput: {
        email,
        password,
      },
    });
  }
  try {
    let user = await models.User.findOne({ where: { email } });
    let hasedPassword = user.password;
    let response = await bcrypt.compare(password, hasedPassword);
    if (response) {
      await Util.saveSession(req, user);
      return res.redirect("/");
    }
    req.flash("message", "Wrong Password");
    return res.redirect("/LogIn");
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    next(error);
    return error;
  }
};
exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
      return error;
    }
    res.redirect("/");
  });
};

exports.getSignUp = (req, res) => {
  let message = req.flash("message");
  message = Util.checkMessage(message);
  res.render("Auth/SignUp", {
    message,
    oldInput: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postSignUp = async (req, res,next) => {
  const { userName, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("Auth/SignUp", {
      message: errors.array()[0].msg,
      oldInput: {
        userName: userName,
        email: email,
        password: password,
      },
    });
  }
  try {
    let hashedPassword = await Util.hash(password);
    await models.User.create({ userName, email, password: hashedPassword });
    return res.redirect("/Login");
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};

exports.getReset = (req, res) => {
  let message = req.flash("message");
  message = Util.checkMessage(message);
  res.render("Auth/Reset", {
    message,
  });
};
exports.postReset = async (req, res,next) => {
  let { email } = req.body;
  try {
    let user = await models.User.findOne({ where: { email } });
    if (!user) {
      req.flash("message", "Account Not Found");
      return res.redirect("/reset");
    }
    let buffer = await Util.generateBuffer(32);
    let token = buffer.toString("hex");
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
    Util.sendMail({
      from: "test@test.com",
      to: req.body.email,
      subject: "Reset Password",
      html: `
    <p>click to this link to reset the password</p>
    <a href="http://localhost:5000/Reset/${token}">Click Here</a>
    `,
    });
    res.redirect("/Login");
  } catch (err) {
    const error = new Error(err);
    error.statusCode=500
    next(error);
    return error ;
  }
};

exports.getNewPassword = async (req, res) => {
  const token = req.params.token;
  try {
    let user = await models.User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: { [sequelize.Op.gt]: Date.now() },
      },
    });
    if (user) {
      let message = req.flash("message");
      message = Util.checkMessage(message);
      return res.render("Auth/NewPassword", {
        message,
        userId: user.id.toString(),
        token,
      });
    }
    req.flash("message", "Invalid Token");
    return res.redirect("/Reset");
  } catch (err) {
    const error = new Error(err);
    next(error);
    return error;
  }
};
exports.postNewPassword = async (req, res) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.token;
  console.log(newPassword, userId, passwordToken);

  try {
    let user = await models.User.findOne({
      where: {
        id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { [sequelize.Op.gt]: Date.now() },
      },
    });
    if (!user) {
      return res.redirect("/Reset");
    }
    let hashedPassword = await Util.hash(newPassword);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect("/Login");
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};
