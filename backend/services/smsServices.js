import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export const sendOTP = async (phone, otp) => {
  await client.messages.create({
    body: `Your Fantasy11 OTP is: ${otp}. Valid for 10 minutes.`,
    from: process.env.TWILIO_PHONE,
    to: `+91${phone}`,
  });
};
