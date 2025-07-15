import api from '@/lib/api';
import { User } from '@/lib/store/auth';
import { toast } from '@/lib/hooks/use-toast';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  full_name: string;
  password: string;
  phone_number?: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface SetPasswordData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ConfirmResetData {
  email: string;
  otp: string;
  new_password: string;
}

export interface LoginOtpRequestData {
  email: string;
}

export interface LoginOtpVerifyData {
  email: string;
  otp: string;
}

export interface SocialLoginData {
  provider: string;
  token: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  message?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ token: string; role: string }> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async signup(data: SignupData): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/signup', data);
      toast({
        title: 'Success',
        description: 'OTP sent to your email. Please verify to complete registration.',
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed';
      toast({
        title: 'Signup Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  }

  async verifyOtp(data: VerifyOtpData): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/verify-otp', data);
      toast({
        title: 'Success',
        description: 'Email verified successfully! Please set your password.',
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast({
        title: 'Verification Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  }

  async setPassword(data: SetPasswordData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/set-password', data);
      toast({
        title: 'Success',
        description: 'Password set successfully!',
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password setup failed';
      toast({
        title: 'Setup Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/forgot-password', data);
      toast({
        title: 'Success',
        description: 'Password reset email sent. Check your inbox.',
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast({
        title: 'Reset Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  }

  async confirmReset(data: ConfirmResetData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/reset-password', data);
      toast({
        title: 'Success',
        description: 'Password reset successfully!',
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password reset confirmation failed';
      toast({
        title: 'Reset Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  }

  async loginOtpRequest(data: LoginOtpRequestData): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/login-otp-request', data);
      toast({
        title: 'Success',
        description: 'OTP sent to your email for login.',
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP request failed';
      toast({
        title: 'Login Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  }

  async loginOtpVerify(data: LoginOtpVerifyData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login-otp-verify', data);
      toast({
        title: 'Success',
        description: 'Login successful!',
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast({
        title: 'Login Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  }

  async socialLogin(data: SocialLoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/social-login', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Social login failed';
      toast({
        title: 'Social Login Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  }

  async checkProtectedRoute(): Promise<{ message: string; user: User }> {
    try {
      const response = await api.get('/auth/protected/dashboard');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

export const authService = new AuthService();