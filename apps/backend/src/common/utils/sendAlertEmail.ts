// src/common/utils/sendAlertEmail.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendAlertEmail = async (subject: string, message: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ALERT_EMAIL_TO || process.env.EMAIL_FROM,
      subject,
      text: message,
    });

    console.log("📧 Alert email sent.");
  } catch (err: any) {
    console.error("❌ Failed to send alert email:", err.message);
  }
};
