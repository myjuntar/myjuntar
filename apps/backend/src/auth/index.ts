import express from 'express';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/protected', protectedRoutes);

export default router;
