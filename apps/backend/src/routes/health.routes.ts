// apps/backend/src/routes/health.routes.ts
import { Router } from "express";
import { redis } from "../utils/redisClient";
import { supabase } from "../utils/supabaseClient";
import nodemailer from "nodemailer";
import os from "os";

const router = Router();

router.get("/", async (req, res) => {
  const result = {
    status: "ok",
    redis: "pending",
    supabase: "pending",
    smtp: "pending",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    hostname: os.hostname(),
    error: {} as Record<string, any>,
  };

  // Redis
  try {
    await redis.set("ping", "pong");
    const value = await redis.get("ping");
    result.redis = value === "pong" ? "connected" : "unexpected value";
  } catch (err: any) {
    result.redis = "disconnected";
    result.error.redis = err.message;
  }

  // Supabase
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error) throw error;
    result.supabase = "connected";
  } catch (err: any) {
    result.supabase = "disconnected";
    result.error.supabase = err.message;
  }

  // SMTP
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();
    result.smtp = "connected";
  } catch (err: any) {
    result.smtp = "disconnected";
    result.error.smtp = err.message;
  }

  const isHealthy = result.redis === "connected" && result.supabase === "connected" && result.smtp === "connected";
  return res.status(isHealthy ? 200 : 500).json(result);
});

export default router;
