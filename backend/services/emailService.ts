import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER) {
    console.log("Email not configured");
    return;
  }
  try {
    await transporter.sendMail({
      from: `"Fantasy11" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent to:", to);
  } catch (err) {
    console.error("Email error:", err.message);
  }
};

export const sendWelcomeEmail = (user) =>
  sendEmail(
    user.email,
    "Welcome to Fantasy11!",
    `<h2>Welcome ${user.name}!</h2>
   <p>Your account has been created successfully.</p>
   <p>Start playing and win real cash prizes!</p>`,
  );

export const sendWithdrawalEmail = (user, amount, status) =>
  sendEmail(
    user.email,
    `Withdrawal ${status} - Fantasy11`,
    `<h2>Withdrawal Update</h2>
   <p>Your withdrawal of Rs.${amount} has been <b>${status}</b>.</p>`,
  );

export const sendKYCEmail = (user, status) =>
  sendEmail(
    user.email,
    `KYC ${status} - Fantasy11`,
    `<h2>KYC Verification Update</h2>
   <p>Your KYC has been <b>${status}</b>.</p>
   ${status === "verified" ? "<p>You can now withdraw your winnings!</p>" : ""}`,
  );
