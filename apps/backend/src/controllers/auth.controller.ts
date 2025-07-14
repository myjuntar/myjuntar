import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { supabase } from "../utils/supabaseClient";
import { generateOtp, storeOtp, validateOtp } from "../services/otp.service";
import { sendOtpEmail } from "../services/emailSender";
import { generateToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";
import { checkOtpRateLimit } from "../utils/checkOtpRateLimit";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const emailSchema = z.object({
  email: z.string().email(),
});

export const signupRequestOTP = async (req: Request, res: Response) => {
  try {
    const { email } = emailSchema.parse(req.body);
    await checkOtpRateLimit(email, "signup");

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await storeOtp(email, otp, "signup", expiresAt);
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "OTP sent to email." });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      otp: z.string().length(6),
    });

    const { email, otp } = schema.parse(req.body);
    const valid = await validateOtp(email, otp, "signup");
    if (!valid) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    await supabase
      .from("email_otps")
      .update({ verified: true })
      .eq("email", email)
      .eq("otp", otp)
      .eq("purpose", "signup");

    return res.status(200).json({ message: "OTP verified." });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const setPassword = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      phone_number: z.string().optional()
    });

    const { email, password, phone_number } = schema.parse(req.body);

    const otpRecord = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", email)
      .eq("purpose", "signup")
      .eq("verified", true)
      .single();

    if (!otpRecord.data) {
      return res.status(400).json({ error: "OTP not verified." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await supabase.from("users").upsert(
      {
        email,
        password_hash: passwordHash,
        is_verified: true,
        role: "regular",
        phone_number
      },
      { onConflict: "email" }
    );

    return res.status(200).json({ message: "Password set. Account created." });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = schema.parse(req.body);

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("❌ Supabase error:", error.message);
      return res.status(500).json({ error: "Internal error fetching user." });
    }

    if (!user) {
      console.warn("⚠️ No user found for email:", email);
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error: any) {
    console.error("🚨 Unexpected login error:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

export const forgotPasswordRequest = async (req: Request, res: Response) => {
  try {
    const { email } = emailSchema.parse(req.body);

    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!user) {
      return res.status(404).json({ error: "Email not registered." });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await storeOtp(email, otp, "reset", expiresAt);
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "OTP sent for password reset." });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      otp: z.string().length(6),
      password: z.string().min(6),
    });

    const { email, otp, password } = schema.parse(req.body);

    const valid = await validateOtp(email, otp, "reset");
    if (!valid) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("email", email);

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const socialLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Missing ID token" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(400).json({ error: "Invalid Google token" });
    }

    const email = payload.email;
    const fullName = payload.name || email;

    const { data: user, error: fetchErr } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (fetchErr) return res.status(500).json({ error: fetchErr.message });

    if (!user) {
      const { error: insertErr } = await supabase.from("users").insert({
        email,
        full_name: fullName,
        is_verified: true,
        role: "regular",
      });

      if (insertErr) return res.status(500).json({ error: insertErr.message });
    }

    const token = generateToken({
      id: user?.id,
      email,
      role: user?.role || "regular",
    });

    return res.status(200).json({ token });
  } catch (err: any) {
    return res
      .status(401)
      .json({ error: "Invalid Google login", detail: err.message });
  }
};
