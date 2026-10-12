import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = Router();

router.get('/stats', protect, adminOnly, async (_req, res) => {
  const [users, products, orders, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
  ]);
  res.json({
    users,
    products,
    orders,
    revenue: revenueAgg[0]?.total || 0,
  });
});

router.get('/users', protect, adminOnly, async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users });
});

router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot delete yourself' });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'Deleted' });
});

export default router;
