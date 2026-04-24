import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  listAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { createCheckoutSession } from '../controllers/paymentController.js';

const router = Router();

router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }),
    body('items.*.product').isMongoId(),
    body('items.*.qty').isInt({ min: 1, max: 20 }),
    body('shippingAddress.line1').trim().isLength({ min: 1 }),
    body('shippingAddress.city').trim().isLength({ min: 1 }),
    body('shippingAddress.country').trim().isLength({ min: 1 }),
  ],
  validate,
  createOrder
);

router.get('/me', protect, getMyOrders);
router.get('/all', protect, adminOnly, listAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.post('/:orderId/pay', protect, createCheckoutSession);

export default router;
