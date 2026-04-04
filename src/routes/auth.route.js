import { Router } from 'express';
import { 
  register, 
  login, 
  logout, 
  refreshTokenHandler, 
  changePassword, 
  forgotPassword, 
  resetPassword, 
  updateProfile 
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/security.middleware.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh', refreshTokenHandler);

router.use(verifyToken);
router.post('/logout', logout);
router.post('/change-password', changePassword);
router.patch('/update-profile', updateProfile);

export default router;