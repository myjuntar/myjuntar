// apps/backend/src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./auth";
import healthRoutes from "./routes/health.routes"
import { errorHandler } from "./common/middleware/errorHandler";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Global Rate Limiter (optional, configurable)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
