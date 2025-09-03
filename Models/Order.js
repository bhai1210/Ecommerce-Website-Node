const mongoose = require('mongoose');


const AddressSchema = new mongoose.Schema({
address: { type: String, required: true },
city: { type: String, required: true },
state: { type: String },
zip: { type: String },
country: { type: String }
});


const CartItemSchema = new mongoose.Schema({
_id: { type: mongoose.Schema.Types.ObjectId, required: true },
name: { type: String, required: true },
price: { type: Number, required: true },
qty: { type: Number, default: 1 },
description: { type: String },
stockcount: { type: Array, default: [] }
});


const OrderSchema = new mongoose.Schema({
submittedAddress: { type: AddressSchema, required: true },
cart: { type: [CartItemSchema], required: true },
checkout: {
address: { type: String },
city: { type: String },
state: { type: String },
zip: { type: String },
country: { type: String }
},
cartTotal: { type: Number, required: true, default: 0 },
shippingCharge: { type: Number, default: 0 },
finalTotal: { type: Number, required: true, default: 0 },
 user: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true }
  },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order', OrderSchema);