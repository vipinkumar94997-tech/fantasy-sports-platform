declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "test" | "production";
    PORT?: string;
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    JWT_EXPIRE?: string;
    JWT_REFRESH_SECRET?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    RAZORPAY_KEY_ID?: string;
    RAZORPAY_KEY_SECRET?: string;
    EMAIL_HOST?: string;
    EMAIL_PORT?: string;
    EMAIL_USER?: string;
    EMAIL_PASS?: string;
    TWILIO_ACCOUNT_SID?: string;
    TWILIO_AUTH_TOKEN?: string;
    TWILIO_PHONE_NUMBER?: string;
    TWILIO_PHONE?: string;
    FAST2SMS_API_KEY?: string;
    FIREBASE_PROJECT_ID?: string;
    FIREBASE_CLIENT_EMAIL?: string;
    FIREBASE_PRIVATE_KEY?: string;
    FIREBASE_SERVICE_ACCOUNT?: string;
  }
}
