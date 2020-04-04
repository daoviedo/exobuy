require('dotenv').config();
const nodemailer = require("nodemailer");



  const transporter =  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "myexobuytest@gmail.com",
      pass: "exobuy123@"
  }
  });



  module.exports = transporter;