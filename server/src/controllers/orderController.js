import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Prices are stored/charged in Bangladeshi Taka (BDT).
// VAT is included in listed prices (common for BD e-commerce), so tax is 0.
// Must match client/src/utils/format.js (FREE_DELIVERY_THRESHOLD / DELIVERY_FEE).
const TAX_RATE = 0;
const SHIPPING_FLAT = 60; // ৳ standard courier fee
const FREE_SHIPPING_THRESHOLD = 999; // ৳ — free delivery above this

export const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!items || !items.length) return res.status(400).json({ message: 'Cart is empty' });

  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });

  const orderItems = [];
  let itemsPrice = 0;
  for (const i of items) {
    const product = products.find((p) => p._id.toString() === i.product);
    if (!product) return res.status(400).json({ message: `Product not found: ${i.product}` });
    if (product.stock < i.qty) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    const discount = (product.price * product.discountPercent) / 100;
    const unitPrice = Math.round((product.price - discount) * 100) / 100;
    itemsPrice += unitPrice * i.qty;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0],
      price: unitPrice,
      qty: i.qty,
    });
  }
  itemsPrice = Math.round(itemsPrice * 100) / 100;
  const taxPrice = Math.round(itemsPrice * TAX_RATE * 100) / 100;
  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json({ order });
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json({ order });
};

export const listAllOrders = async (_req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ orders });
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }
  await order.save();
  res.json({ order });
};
