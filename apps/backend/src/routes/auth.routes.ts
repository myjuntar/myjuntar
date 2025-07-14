
import { Router } from 'express';
import {
  signupRequestOTP,
  verifyOTP,
  setPassword,
  loginUser,
  forgotPasswordRequest,
  resetPassword,
  socialLogin,
  loginOtpRequest,
  loginOtpVerify
} from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signupRequestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/set-password', setPassword);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPasswordRequest);
router.post('/reset-password', resetPassword);
router.post("/social-login", socialLogin);
router.post("/login-otp-request", loginOtpRequest);
router.post("/login-otp-verify", loginOtpVerify);

export default router;
