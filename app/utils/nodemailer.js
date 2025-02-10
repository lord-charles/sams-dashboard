import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
});

export const mailOptions = {
  from: process.env.EMAIL_FROM,
  to: process.env.EMAIL_TO,
};
