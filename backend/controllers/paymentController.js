import razorpay from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const options = {
      amount: 500 * 100,
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Order failed",
    });
  }
};
