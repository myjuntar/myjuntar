
import { Router } from 'express';
import {
  signupRequestOTP,
  verifyOTP,
  setPassword,
  loginUser,
  forgotPasswordRequest,
  resetPassword
} from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signupRequestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/set-password', setPassword);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPasswordRequest);
router.post('/reset-password', resetPassword);

export default router;
