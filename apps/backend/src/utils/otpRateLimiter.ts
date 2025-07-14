// utils/otpRateLimiter.ts
import redis from "./redisClient";

export async function enforceOtpRateLimit(identifier: string, ip?: string): Promise<void> {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxPerDay = 3;

  const countKey = `otp:count:${identifier}`;
  const timeKey = `otp:last:${identifier}`;
  const ipKey = ip ? `otp:ip:${ip}` : null;

  // Check last timestamp
  const lastSent = await redis.get(timeKey);
  if (lastSent) {
    const secondsAgo = Math.floor((now - parseInt(lastSent)) / 1000);
    if (secondsAgo < 60) {
      const retryAfter = 60 - secondsAgo;
      throw new Error(`OTP already sent. Please retry after ${retryAfter} seconds.`);
    }
  }

  // Count for the day (24hr window)
  const dayCount = await redis.get(countKey);
  if (dayCount && parseInt(dayCount) >= maxPerDay) {
    throw new Error("You have exceeded the OTP request limit for today. Please try again tomorrow.");
  }

  // IP level throttle (5 per 10 minutes)
  if (ipKey) {
    const ipCount = await redis.incr(ipKey);
    if (ipCount === 1) await redis.expire(ipKey, 600);
    if (ipCount > 5) {
      throw new Error("Too many OTP requests from your IP. Please wait and try again later.");
    }
  }

  // Set current timestamp and increment count
  await redis.set(timeKey, now.toString(), "EX", 600);
  await redis.incr(countKey);
  await redis.expire(countKey, 86400);
}
