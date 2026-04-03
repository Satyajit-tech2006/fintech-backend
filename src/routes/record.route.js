import { Router } from 'express';
import { create, getSummary, getAll, update, remove } from '../controllers/record.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/summary', requireRole(['ANALYST', 'ADMIN']), getSummary);
router.get('/', requireRole(['ANALYST', 'ADMIN']), getAll);

router.post('/', requireRole(['ADMIN']), create);
router.put('/:id', requireRole(['ADMIN']), update);
router.delete('/:id', requireRole(['ADMIN']), remove);

export default router;