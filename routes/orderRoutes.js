const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');


router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);


module.exports = router;