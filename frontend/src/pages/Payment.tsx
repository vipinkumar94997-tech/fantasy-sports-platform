import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { walletService } from "../services/walletService";
import { loadRazorpay } from "../utils/loadRazorpay";

const Payment = () => {
  const checkoutRef = useRef<RazorpayInstance | null>(null);
  const paymentInProgressRef = useRef(false);

  useEffect(
    () => () => {
      checkoutRef.current?.close();
      checkoutRef.current = null;
      paymentInProgressRef.current = false;
    },
    [],
  );

  const handlePayment = async () => {
    if (paymentInProgressRef.current) return;
    paymentInProgressRef.current = true;

    const releaseCheckout = () => {
      paymentInProgressRef.current = false;
      checkoutRef.current = null;
    };

    try {
      await loadRazorpay();
      const { data } = await walletService.addMoney({ amount: 500 });
      if (!window.Razorpay) throw new Error("Razorpay Checkout unavailable");

      const options: RazorpayOptions = {
        key: data.razorpayKey,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Fantasy11",
        description: "Wallet Add Money",
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            await walletService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful");
          } catch {
            toast.error("Payment verification failed. Contact support.");
          } finally {
            releaseCheckout();
          }
        },
        modal: { ondismiss: releaseCheckout },
      };

      const razorpay = new window.Razorpay(options);
      checkoutRef.current = razorpay;
      razorpay.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        releaseCheckout();
      });
      razorpay.open();
    } catch {
      releaseCheckout();
      toast.error("Unable to start payment");
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
};

export default Payment;
