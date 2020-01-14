require('dotenv').config();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "web02.getshell.de",
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASS // generated ethereal password
    }
  });

  module.exports = transporter;