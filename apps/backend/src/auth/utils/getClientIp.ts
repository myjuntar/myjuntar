// utils/getClientIp.ts
import { Request } from "express";

export const getClientIp = (req: Request): string => {
  return req.ip || req.headers["x-forwarded-for"]?.toString() || "127.0.0.1";
};
