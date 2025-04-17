// Razorpay.jsx
import axios from "axios";
import React from "react";

export const RazorpayButton = ({ amount = 500, prescriptionId, onSuccess }) => {
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCreateOrder = async () => {
    try {
      const order = await axios.post("/payment/create_order", {
        amount, // ✅ dynamic
        currency: "INR",
        receipt: prescriptionId,
      });

      displayRazorpay(order.data);
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  const displayRazorpay = async (orderData) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const patientName = localStorage.getItem("name") || "Patient";
    const patientEmail = localStorage.getItem("email") || "example@demo.com";
    const patientId = localStorage.getItem("id");

    const options = {
      key: "rzp_test_gCNjkl3yd0SQak",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "HealthCare App",
      description: "Prescription Payment",
      order_id: orderData.id,
      handler: async function (response) {
        const verify = await axios.post("/payment/verify_order", {
          ...response,
          receipt: prescriptionId,
          patientId,
          amount: orderData.amount / 100, // in rupees
        });

        if (verify.data.status === "success") {
          alert("✅ Payment verified and invoice emailed.");
          onSuccess && onSuccess();
        } else {
          alert("❌ Payment verification failed.");
        }
      },
      prefill: {
        name: patientName,
        email: patientEmail,
      },
      theme: {
        color: "#4CAF50",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handleCreateOrder} className="btn btn-success">
      Pay ₹{amount}
    </button>
  );
};