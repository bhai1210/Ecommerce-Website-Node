const razorpay = require("../ConfigData/razorpay");
const Payment = require("../Models/paymentModel");
const crypto = require("crypto");

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Amount is required and must be greater than 0" });
    }

    const options = {
      amount: amount * 100, // in paise
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const newPayment = new Payment({
      orderId: order.id,
      amount,
      currency: order.currency,
      status: "created",
    });

    await newPayment.save();

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify Razorpay Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { paymentId: razorpay_payment_id, signature: razorpay_signature, status: "paid" }
      );
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: "failed" }
      );
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};