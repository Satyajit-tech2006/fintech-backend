import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { authLimiter } from '../middlewares/security.middleware.js';

const router = Router();

//applied limiters to prevent overload of authentication endpoints and mitigate brute-force attacks
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

export default router;