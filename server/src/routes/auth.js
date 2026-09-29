import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { register, login, logout, me, updateProfile } from '../controllers/authController.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 chars'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6, max: 128 }).withMessage('Password must be 6-128 chars'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 1, max: 128 }),
  ],
  validate,
  login
);

router.post('/logout', logout);
router.get('/me', protect, me);
router.put(
  '/me',
  protect,
  [
    body('name').optional().trim().isLength({ min: 2, max: 80 }),
    body('password').optional().isLength({ min: 6, max: 128 }),
  ],
  validate,
  updateProfile
);

export default router;
