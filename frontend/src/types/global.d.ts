interface RazorpayInstance {
  open(): void;
  on(event: string, callback: (response: RazorpayFailureResponse) => void): void;
}

interface RazorpayFailureResponse {
  error: { description: string; [key: string]: unknown };
}

interface RazorpayConstructor {
  new (options: Record<string, unknown>): RazorpayInstance;
}

interface Window {
  Razorpay?: RazorpayConstructor;
}
