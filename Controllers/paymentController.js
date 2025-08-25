const razorpay = require("../ConfigData/razorpay"); // must be configured properly
const Payment = require("../Models/paymentModel");
const crypto = require("crypto");

// ✅ Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    let { amount, currency, receipt } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount is required and must be a number greater than 0",
      });
    }

    // ✅ Razorpay needs amount in paise (integer)
    amount = Math.round(amount * 100);

    const options = {
      amount, // in paise
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // ✅ auto-capture payments
    };

    // Create order with Razorpay SDK
    const order = await razorpay.orders.create(options);

    // Save in DB
    const newPayment = new Payment({
      orderId: order.id,
      amount: order.amount, // save paise for consistency
      currency: order.currency,
      status: order.status, // "created"
    });

    await newPayment.save();

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Razorpay createOrder error:", err);
    res.status(500).json({ success: false, message: err.error?.description || err.message });
  }
};

// ✅ Verify Razorpay Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: "paid",
        }
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
    console.error("Razorpay verifyPayment error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Fetch all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
