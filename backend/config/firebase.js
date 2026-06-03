import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

let firebaseApp = null;

export const initFirebase = () => {
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.log("Firebase not configured — push notifications disabled");
    return null;
  }
  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase initialized");
    return firebaseApp;
  } catch (err) {
    console.error("Firebase init error:", err.message);
    return null;
  }
};

export const sendPushNotification = async (token, title, body) => {
  if (!firebaseApp) return;
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      android: { priority: "high" },
      apns: { payload: { aps: { sound: "default" } } },
    });
  } catch (err) {
    console.error("Push notification error:", err.message);
  }
};

export default admin;
