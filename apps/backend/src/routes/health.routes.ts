// src/routes/health.routes.ts
import express from "express";
import { redis } from "../utils/redisClient";
import { supabase } from "../utils/supabaseClient";
import nodemailer from "nodemailer";
import os from "os";
import { sendAlertEmail } from "../utils/sendAlertEmail";

const router = express.Router();

router.get("/", async (req, res) => {
  const health = {
    redis: false,
    supabase: false,
    smtp: false,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage().rss,
    hostname: os.hostname(),
  };

  // Redis
  try {
    await redis.set("ping", "pong");
    const value = await redis.get("ping");
    if (value === "pong") health.redis = true;
    else throw new Error("Redis mismatch");
  } catch (err: any) {
    await sendAlertEmail("❌ Redis Health Check Failed", err.message);
  }

  // Supabase
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (!error) health.supabase = true;
    else throw error;
  } catch (err: any) {
    await sendAlertEmail("❌ Supabase Health Check Failed", err.message);
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
    health.smtp = true;
  } catch (err: any) {
    await sendAlertEmail("❌ SMTP Health Check Failed", err.message);
  }

  res.status(200).json({
    status: health.redis && health.supabase && health.smtp ? "ok" : "degraded",
    services: health,
    timestamp: new Date(),
  });
});

export default router;
