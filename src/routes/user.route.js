import { Router } from 'express';
import { getAll, changeRole, changeStatus } from '../controllers/user.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all user routes
router.use(verifyToken);
router.use(requireRole(['ADMIN']));

router.get('/', getAll);
router.patch('/:id/role', changeRole);
router.patch('/:id/status', changeStatus);

export default router;