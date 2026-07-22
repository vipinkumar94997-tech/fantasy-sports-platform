interface RazorpayInstance {
  open(): void;
  close(): void;
  on(event: string, callback: (response: RazorpayFailureResponse) => void): void;
}

interface RazorpayFailureResponse {
  error: {
    code?: string;
    description: string;
    reason?: string;
    source?: string;
    step?: string;
    metadata?: Record<string, string>;
  };
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number | string;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

interface Window {
  Razorpay?: RazorpayConstructor;
}
