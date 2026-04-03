import { Router } from 'express';
import { create, getSummary } from '../controllers/record.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/summary', requireRole(['ANALYST', 'ADMIN']), getSummary);
router.post('/', requireRole(['ADMIN']), create);

export default router;