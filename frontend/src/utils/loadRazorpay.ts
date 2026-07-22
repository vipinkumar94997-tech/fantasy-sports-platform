const RAZORPAY_SCRIPT_ID = "razorpay-checkout-sdk";
const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayLoadPromise: Promise<void> | null = null;

export const loadRazorpay = (): Promise<void> => {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayLoadPromise) return razorpayLoadPromise;

  razorpayLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(
      RAZORPAY_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");

    const handleLoad = () => {
      cleanup();
      if (window.Razorpay) resolve();
      else reject(new Error("Razorpay Checkout did not initialize"));
    };
    const handleError = () => {
      cleanup();
      script.remove();
      razorpayLoadPromise = null;
      reject(new Error("Unable to load Razorpay Checkout"));
    };
    const cleanup = () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existing) {
      script.id = RAZORPAY_SCRIPT_ID;
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return razorpayLoadPromise;
};
