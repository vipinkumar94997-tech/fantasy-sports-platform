import { sendPushNotification } from "../config/firebase.js";

export const sendPush = async (fcmToken, title, body, data = {}) => {
  if (!fcmToken) return;
  try {
    await sendPushNotification(fcmToken, title, body);
  } catch (err) {
    console.error("Push service error:", err.message);
  }
};

export const sendMatchAlert = (fcmToken, matchName) =>
  sendPush(
    fcmToken,
    "🏏 Match Starting Soon!",
    `${matchName} starts in 30 minutes. Create your team now!`,
  );

export const sendContestWin = (fcmToken, amount) =>
  sendPush(fcmToken, "🏆 You Won!", `Congratulations! You won Rs.${amount}!`);

export const sendWithdrawalUpdate = (fcmToken, status) =>
  sendPush(fcmToken, "Withdrawal Update", `Your withdrawal has been ${status}`);
