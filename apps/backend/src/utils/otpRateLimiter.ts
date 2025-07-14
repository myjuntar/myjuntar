import redis from './redisClient';

const COOLDOWN_SECONDS = 60;
const MAX_DAILY_LIMIT = 3;

export const enforceOtpRateLimit = async (identifier: string, ip: string): Promise<void> => {
  const keyBase = `otp:limit:${identifier}`;
  const ipKey = `otp:ip:${ip}`;
  const now = Date.now();

  // Per-user cooldown check
  const lastSent = await redis.get(`${keyBase}:last_sent`);
  if (lastSent) {
    const diff = Math.floor((now - parseInt(lastSent)) / 1000);
    if (diff < COOLDOWN_SECONDS) {
      throw {
        message: 'OTP already sent. Please wait.',
        retryAfter: COOLDOWN_SECONDS - diff,
      };
    }
  }

  // Per-user daily limit
  const countKey = `${keyBase}:count`;
  const count = parseInt((await redis.get(countKey)) || '0');
  if (count >= MAX_DAILY_LIMIT) {
    throw {
      message: 'You have exceeded the OTP request limit for today.',
    };
  }

  // Per-IP basic rate limit
  const ipCount = parseInt((await redis.get(ipKey)) || '0');
  if (ipCount >= 20) {
    throw { message: 'Too many requests from this IP. Try later.' };
  }

  // Set/update counters
  await redis.set(`${keyBase}:last_sent`, now.toString(), { EX: COOLDOWN_SECONDS });

  await redis.incr(countKey);
  await redis.expire(countKey, 24 * 3600);

  await redis.incr(ipKey);
  await redis.expire(ipKey, 3600);
};
