import { supabase } from '../utils/supabaseClient';

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOtp = async (
  email: string,
  otp: string,
  purpose: 'signup' | 'reset',
  expiresAt: Date
) => {
  // Invalidate previous OTPs for the same purpose
  await supabase
    .from('email_otps')
    .delete()
    .eq('email', email)
    .eq('purpose', purpose);

  const { error } = await supabase.from('email_otps').insert({
    email,
    otp,
    purpose,
    expires_at: expiresAt
  });

  if (error) throw new Error('Failed to store OTP');
};

export const validateOtp = async (
  email: string,
  otp: string,
  purpose: 'signup' | 'reset'
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('email_otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .eq('purpose', purpose)
    .eq('verified', false)
    .gte('expires_at', new Date().toISOString())
    .single();

  return !error && !!data;
};
