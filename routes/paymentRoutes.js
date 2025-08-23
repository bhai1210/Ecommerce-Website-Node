const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment,getPayments } = require("../Controllers/paymentController");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/history", getPayments);


module.exports = router;
