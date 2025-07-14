import { supabase } from '../utils/supabaseClient';

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export type OtpPurpose = 'signup' | 'reset' | 'login';

export const storeOtp = async (
  email: string,
  otp: string,
  purpose: OtpPurpose,
  expiresAt: Date
) => {
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
  emailOrPhone: string,
  otp: string,
  purpose: 'signup' | 'reset' | 'login'  // <-- add 'login'
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('email_otps')
    .select('*')
    .eq('email', emailOrPhone)
    .eq('otp', otp)
    .eq('purpose', purpose)
    .eq('verified', false)
    .gte('expires_at', new Date().toISOString())
    .single();

  return !error && !!data;
};