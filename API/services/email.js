require("dotenv").config();
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");

aws.config.loadFromPath("./services/email.json");

const transporter = nodemailer.createTransport({
  port: 465,
  host: 'email-smtp.us-east-1.amazonaws.com',
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true
});

module.exports = transporter;
