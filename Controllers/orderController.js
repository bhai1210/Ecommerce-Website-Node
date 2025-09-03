const Order = require('../Models/Order');


// Create a new order (POST /api/orders)
// Create a new order (POST /api/orders)
exports.createOrder = async (req, res, next) => {
  try {
    const payload = req.body;

    // Basic validation
    if (!payload.submittedAddress || !payload.cart || !Array.isArray(payload.cart)) {
      return res.status(400).json({ message: 'Invalid payload. submittedAddress and cart required.' });
    }

    // Compute totals if not provided
    const cartTotal = payload.cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;
      return sum + price * qty;
    }, 0);

    const shippingCharge =
      payload.shippingCharge != null ? Number(payload.shippingCharge) : 0;
    const finalTotal =
      payload.finalTotal != null ? Number(payload.finalTotal) : cartTotal + shippingCharge;

    // ✅ Include user in order
    const order = new Order({
      submittedAddress: payload.submittedAddress,
      cart: payload.cart,
      checkout: payload.checkout || {},
      cartTotal,
      shippingCharge,
      finalTotal,
      user: {
        _id: payload.user?._id,
        email: payload.user?.email,
        role: payload.user?.role,
      },
    });

    const saved = await order.save();
    return res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};



// Get all orders (GET /api/orders)
exports.getOrders = async (req, res, next) => {
try {
const orders = await Order.find().sort({ createdAt: -1 });
res.json(orders);
} catch (err) {
next(err);
}
};


// Get single order (GET /api/orders/:id)
exports.getOrderById = async (req, res, next) => {
try {
const order = await Order.findById(req.params.id);
if (!order) return res.status(404).json({ message: 'Order not found' });
res.json(order);
} catch (err) {
next(err);
}
};