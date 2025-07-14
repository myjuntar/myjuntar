import { supabase } from '../../config/supabaseClient';

export async function checkOtpRateLimit(email: string, purpose: string): Promise<void> {
  // Step 1: Block if user already exists (only for signup)
  if (purpose === "signup") {
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      throw new Error("Email already registered. Please login.");
    }
  }

  // Step 2: Enforce 1-minute cooldown
  const { data: lastOtp } = await supabase
    .from("email_otps")
    .select("created_at")
    .eq("email", email)
    .eq("purpose", purpose)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastOtp) {
    const secondsSinceLast = (Date.now() - new Date(lastOtp.created_at).getTime()) / 1000;
    if (secondsSinceLast < 60) {
      throw new Error(`OTP already sent. Please wait ${Math.ceil(60 - secondsSinceLast)} seconds.`);
    }
  }

  // Step 3: Max 3 OTPs in 24 hours
  const { count } = await supabase
    .from("email_otps")
    .select("*", { count: "exact", head: true })
    .eq("email", email)
    .eq("purpose", purpose)
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (count !== null && count >= 3) {
    throw new Error("You have exceeded the OTP request limit for today. Please try again tomorrow.");
  }
}
