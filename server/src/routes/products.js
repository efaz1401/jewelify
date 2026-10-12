import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} from '../controllers/productController.js';

const router = Router();

router.get('/', listProducts);
router.get('/:slug', getProduct);

router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').trim().isLength({ min: 2, max: 140 }),
    body('description').trim().isLength({ min: 2, max: 4000 }),
    body('price').isFloat({ min: 0 }),
    body('category').isMongoId(),
    body('stock').optional().isInt({ min: 0 }),
    body('discountPercent').optional().isFloat({ min: 0, max: 90 }),
  ],
  validate,
  createProduct
);

router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

router.post(
  '/:id/reviews',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().isLength({ max: 1000 }),
  ],
  validate,
  addReview
);

export default router;
