import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export async function sendEmail({
  to,
  cc,
  bcc,
  subject,
  html,
  attachments = [],
} = {}) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // Admin Gmail ID
      pass: process.env.EMAIL_PASS, // Admin Gmail Password
    },
  });

  //send email

  let info = await transporter.sendMail({
    from: `abdallah Co. <${process.env.EMAIL_USER}>`,
    to,
    cc,
    bcc,
    subject,
    html,
    attachments,
  });
  return info.rejected.length ? false : true;
}
