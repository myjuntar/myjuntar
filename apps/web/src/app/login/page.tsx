"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, User } from '@/lib/store/auth';
import { authService } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Heart, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from '@/lib/hooks/use-toast';
import Link from 'next/link';
import { decodeJwt } from '@/lib/utils';
import { useGuestRedirect } from '@/lib/hooks/use-guest-redirect';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  useGuestRedirect();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, setLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoading(true);

    try {
      const { token, role } = await authService.login({ email, password });

      // ✅ Ensure role is correctly typed
      const allowedRoles = ['user', 'super_admin', 'venue_owner', 'customer_support'] as const;
      const userRole = allowedRoles.includes(role as any) ? (role as User['role']) : 'user';

      // ✅ Decode JWT payload
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = decodeJwt(token);

      // ✅ Construct user object that matches Zustand store interface
      const user: User = {
        id: decodedPayload.id,
        email: decodedPayload.email,
        name: '', // you can later fetch name separately
        role: userRole,
        email_verified: true,
      };

      // ✅ Store token and user in Zustand
      login(user, token);

      // ✅ Redirect based on role
      const redirectPath =
        userRole === 'super_admin' ||
          userRole === 'venue_owner' ||
          userRole === 'customer_support'
          ? '/dashboard'
          : '/account';

      router.push(redirectPath);

      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.response?.data?.error || 'Login failed.';
      toast({
        title: 'Login Failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-gold-light via-champagne to-blush p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to website
          </Link>
        </div>
        <Card className="shadow-elegant">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-gold to-primary">
                <Heart className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-rose-gold to-primary bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Sign in to your MY JUNTAR account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="elegant"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="w-full">
              <GoogleLogin
                shape="circle"
                theme="filled_blue"
                width="full-width"
                onSuccess={async (response) => {
                  const idToken = response.credential;

                  if (!idToken) {
                    toast({
                      title: 'Google Login Failed',
                      description: 'Missing ID token from Google.',
                      variant: 'destructive',
                    });
                    return;
                  }

                  try {
                    const { token } = await authService.socialLogin(idToken);

                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const user: User = {
                      id: payload.id,
                      email: payload.email,
                      name: payload.name ?? '',
                      role: payload.role as User['role'],
                      email_verified: true,
                    };

                    login(user, token);

                    const redirectPath =
                      ['super_admin', 'venue_owner', 'customer_support'].includes(user.role)
                        ? '/dashboard'
                        : '/account';

                    router.push(redirectPath);
                  } catch (err) {
                    toast({
                      title: 'Social Login Failed',
                      description: 'Invalid Google token or server error',
                      variant: 'destructive',
                    });
                  }
                }}

                onError={() =>
                  toast({
                    title: 'Social Login Error',
                    description: 'Google login failed.',
                    variant: 'destructive',
                  })
                }
              />
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Login;