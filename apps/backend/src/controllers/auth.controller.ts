import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { supabase } from "../utils/supabaseClient";
import { generateOtp, markOtpAsVerified, storeOtp, validateOtp } from "../services/otp.service";
import { sendOtpEmail } from "../services/emailSender";
import { generateToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";
import { redis } from "../utils/redisClient";
import { enforceOtpRateLimit } from "../utils/otpRateLimiter";
import { sendOtpSms } from "../utils/smsSender";
import { getClientIp } from "../utils/getClientIp";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const emailSchema = z.object({
  email: z.string().email(),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone_number: z.string().optional(),
  full_name: z.string().optional(),
});

export const signupRequestOTP = async (req: Request, res: Response) => {
  try {
    const { email, password, phone_number, full_name } = signupSchema.parse(req.body);

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered. Please login." });
    }

    try {
      const ip = getClientIp(req);
      await enforceOtpRateLimit(email, ip);
    } catch (err: any) {
      return res.status(429).json({
        error: err.message,
        ...(err.retryAfter && { retryAfter: err.retryAfter }),
      });
    }

    const otp = generateOtp();
    const userPayload = JSON.stringify({ email, password, phone_number, full_name });

    await redis.set(`otp:${email}`, userPayload, { ex: 600 });
    if (phone_number) {
      await redis.set(`otp:phone:${phone_number}`, userPayload, { ex: 600 });
    }

    await storeOtp(email, otp, "signup", new Date(Date.now() + 10 * 60 * 1000));
    await sendOtpEmail(email, otp);

    if (phone_number) {
      await sendOtpSms(phone_number, otp);
    }

    return res.status(200).json({ message: "OTP sent to email and phone (if provided)." });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      otp: z.string().length(6),
    });

    const { email, phone, otp } = schema.parse(req.body);

    if (!email && !phone) {
      return res.status(400).json({ error: "Either email or phone is required." });
    }

    const redisKey = email ? `otp:${email}` : `otp:phone:${phone}`;
    const identifier = email ?? phone;
    if (!identifier) {
      return res.status(400).json({ error: "Identifier is required for OTP validation." });
    }
    const valid = await validateOtp(identifier, otp, "signup");

    if (!valid) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    await markOtpAsVerified(identifier, otp, "signup");

    const payload = await redis.get(redisKey);
    if (!payload) {
      return res.status(400).json({ error: "Session expired. Please start signup again." });
    }
    if (typeof payload !== "string") {
      return res.status(400).json({ error: "Invalid session payload." });
    }
    const { password, phone_number, full_name } = JSON.parse(payload);
    const password_hash = await bcrypt.hash(password, 10);

    const { error } = await supabase.from("users").insert({
      email: email || undefined,
      password_hash,
      phone_number: phone || phone_number,
      full_name,
      is_verified: true,
      role: "regular",
    });

    if (error) {
      return res.status(500).json({ error: "User creation failed", detail: error.message });
    }

    await redis.del(redisKey);

    return res.status(201).json({ message: "Signup complete. You can now login." });
  } catch (error: any) {
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

    try {
      const ip = getClientIp(req);
      await enforceOtpRateLimit(email, ip);
    } catch (err: any) {
      return res.status(429).json({
        error: err.message,
        ...(err.retryAfter && { retryAfter: err.retryAfter }),
      });
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
      email: z.string().email().optional(),
      phone: z.string().optional(),
      password: z.string(),
    });

    const { email, phone, password } = schema.parse(req.body);

    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone is required." });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq(email ? "email" : "phone_number", email || phone)
      .maybeSingle();

    if (error) {
      console.error("❌ Supabase error:", error.message);
      return res.status(500).json({ error: "Internal error fetching user." });
    }

    if (!user) {
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
    await markOtpAsVerified(email, otp, "reset");


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

export const loginOtpRequest = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      phone: z.string().min(10),
    });
    const { phone } = schema.parse(req.body);

    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("phone_number", phone)
      .maybeSingle();

    if (!user) {
      return res.status(404).json({ error: "Phone number not registered." });
    }
    try {
      const ip = getClientIp(req);
      await enforceOtpRateLimit(phone, ip);
    } catch (err: any) {
      return res.status(429).json({
        error: err.message,
        ...(err.retryAfter && { retryAfter: err.retryAfter }),
      });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await storeOtp(phone, otp, "login", expiresAt);
    await sendOtpSms(phone, otp);

    return res.status(200).json({ message: "OTP sent to phone." });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const loginOtpVerify = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      phone: z.string().min(10),
      otp: z.string().length(6),
    });
    const { phone, otp } = schema.parse(req.body);

    const valid = await validateOtp(phone, otp, "login");
    if (!valid) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }
    await markOtpAsVerified(phone, otp, "login");


    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone_number", phone)
      .maybeSingle();

    if (error || !user) {
      return res.status(404).json({ error: "User not found." });
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
    return res.status(400).json({ error: error.message });
  }
};

