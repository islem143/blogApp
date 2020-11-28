const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const fs = require("fs");
let transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.checkMessage = (message) => {
  if (message.length > 0) {
    return message[0];
  } else {
    return null;
  }
};

exports.hash = (passowrd) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(passowrd, 12, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
};
exports.saveSession = (req, user) => {
  return new Promise((resolve, reject) => {
    req.session.userId = user.id;
    req.session.isAuth = true;
    req.session.save((err) => {
      if (err) reject(err);
      resolve("saved");
    });
  });
};
exports.generateBuffer = (number) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(number, (err, buffer) => {
      if (err) {
        reject(err);
      }
      resolve(buffer);
    });
  });
};

exports.sendMail = (option) => {
  transport.sendMail(option, (err, info) => {
    if (err) reject(err);
    resolve(info);
  });
};

exports.deleteFile = (path) => {
  return fs.unlink(path, (err) => {
    if (err) {
      throw new Error(err);
    }
  });
};
