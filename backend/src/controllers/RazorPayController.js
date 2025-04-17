const Razorpay = require("razorpay");
const EPrescription = require('../models/EPrescriptionsModel');
const User  = require("../models/UserModel")
const nodemailer = require("nodemailer");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    const order = await instance.orders.create({
      amount: amount * 100,
      currency,
      receipt,
    });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating Razorpay order", error: err.message });
  }
};

exports.verifyOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, receipt, patientId } = req.body;

    // Update prescription status
    const prescription = await EPrescription.findByIdAndUpdate(
      receipt,
      { paymentStatus: "paid", paymentId: razorpay_payment_id },
      { new: true }
    ).populate("patientId", "name email");

    if (!prescription) {
      return res.status(404).json({ status: "error", message: "Prescription not found" });
    }

    // Send dynamic email
    const patient = prescription.patientId;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const invoiceHtml = `
    <h2> E-Prescription Invoice</h2>
    <p><strong>Patient:</strong> ${patient.name}</p>
    <p><strong>Email:</strong> ${patient.email}</p>
    <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
    <p><strong>Amount:</strong> ₹${req.body.amount || "500"}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <hr />
    <p>✅ Your payment is successful. Thank you!</p>
  `;
    await transporter.sendMail({
      from: `"HealthCare App" <${process.env.MAIL_USER}>`,
      to: patient.email,
      subject: "Your E-Prescription Invoice",
      html: invoiceHtml,
    });

    res.status(200).json({ status: "success", message: "Payment verified and invoice emailed." });
  } catch (err) {
    console.error("Payment verify error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};