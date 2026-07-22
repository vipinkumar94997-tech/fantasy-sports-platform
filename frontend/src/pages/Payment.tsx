import axios from "axios";

const Payment = () => {
  const handlePayment = async () => {
    console.log("Button Clicked");
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/payment/create-order",
      );

      const options = {
        key: "rzp_test_xxxxx",

        amount: data.amount,

        currency: data.currency,

        order_id: data.id,

        name: "Fantasy11",

        description: "Test Payment",

        handler: function (response) {
          console.log(response);

          alert("Payment Success");
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.log(error);
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
};

export default Payment;
