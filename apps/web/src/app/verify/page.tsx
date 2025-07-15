"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Mail, Lock } from 'lucide-react';
import { toast } from '@/lib/hooks/use-toast';
import { useGuestRedirect } from '@/lib/hooks/use-guest-redirect';
import Cookies from 'js-cookie';

const Verify = () => {
  useGuestRedirect();
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [otpVerified, setOtpVerified] = useState(false);

  const router = useRouter();

  const [email, setEmail] = useState('');
  useEffect(() => {
    const storedEmail = Cookies.get('signupEmail');
    if (!storedEmail) {
      router.push('/signup');
    } else {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.verifyOtp({ email, otp });
      setOtpVerified(true);
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.setPassword({ email, password });
      Cookies.remove('signupEmail');
      // Since we have user data now, we can redirect
      toast({
        title: 'Success',
        description: 'Account created successfully! Please login.',
      });

      router.push('/login');
    } catch (error) {
      console.error('Password setup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);

    try {
      await authService.signup({
        email,
        full_name: '',
        password: 'temporarypassord',
        phone_number: ''
      });
      setCanResend(false);
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: 'OTP Resent',
        description: 'A new OTP has been sent to your email.',
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-gold-light via-champagne to-blush p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-elegant">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-gold to-primary">
                <Heart className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-rose-gold to-primary bg-clip-text text-transparent">
                {otpVerified ? 'Set Your Password' : 'Verify Your Email'}
              </CardTitle>
              <CardDescription>
                {otpVerified
                  ? 'Create a secure password for your account'
                  : `We've sent a 6-digit code to ${email}`
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!otpVerified ? (
              <>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-gold-light rounded-full mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Please check your email and enter the verification code below
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="elegant"
                    className="w-full"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                  </Button>
                </form>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  {canResend ? (
                    <Button
                      variant="ghost"
                      onClick={handleResendOtp}
                      disabled={resendLoading}
                      className="text-primary"
                    >
                      {resendLoading ? 'Resending...' : 'Resend Code'}
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Resend in {countdown} seconds
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-gold-light rounded-full mb-4">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your email has been verified. Now set a secure password.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="elegant"
                    className="w-full"
                    disabled={isLoading || !password || !confirmPassword}
                  >
                    {isLoading ? 'Setting Password...' : 'Set Password'}
                  </Button>
                </form>
              </>
            )}

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Wrong email? </span>
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Go back
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Verify