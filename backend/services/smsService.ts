import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendOTP = async (phone, otp) => {
  if (!process.env.FAST2SMS_API_KEY) {
    console.log(`[DEV MODE] OTP for ${phone}: ${otp}`);
    return { success: true, dev: true };
  }
  try {
    const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        variables_values: otp,
        route: "otp",
        numbers: phone,
      },
    });
    console.log("SMS sent:", response.data);
    return response.data;
  } catch (err) {
    console.error("SMS error:", err.message);
    console.log(`[FALLBACK] OTP for ${phone}: ${otp}`);
    return { success: false };
  }
};
