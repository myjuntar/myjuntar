import { redis } from "../../config/redisClient";


const COOLDOWN_SECONDS = 60;
const MAX_DAILY_LIMIT = 50;

export const enforceOtpRateLimit = async (identifier: string, ip: string): Promise<void> => {
  const keyBase = `otp:limit:${identifier}`;
  const ipKey = `otp:ip:${ip}`;
  const now = Date.now();

  const lastSent = await redis.get(`${keyBase}:last_sent`) as string | null;
  if (lastSent) {
    const diff = Math.floor((now - parseInt(lastSent)) / 1000);
    if (diff < COOLDOWN_SECONDS) {
      throw {
        message: 'OTP already sent. Please wait.',
        retryAfter: COOLDOWN_SECONDS - diff,
      };
    }
  }

  const countKey = `${keyBase}:count`;
  const count = parseInt((await redis.get(countKey) as string | null) || '0');
  if (count >= MAX_DAILY_LIMIT) {
    throw { message: 'You have exceeded the OTP request limit for today.' };
  }

  const ipCount = parseInt((await redis.get(ipKey) as string | null) || '0');
  if (ipCount >= 200) {
    throw { message: 'Too many requests from this IP. Try later.' };
  }

  await redis.set(`${keyBase}:last_sent`, now.toString(), { ex: COOLDOWN_SECONDS }); // ✅ lowercase `ex`
  await redis.incr(countKey);
  await redis.expire(countKey, 24 * 3600);
  await redis.incr(ipKey);
  await redis.expire(ipKey, 3600);
};
