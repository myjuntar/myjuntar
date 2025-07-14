import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';
import healthRoutes from './routes/health.routes'

// Use CommonJS-compatible fetch (v2)
const fetch = require('node-fetch');
(globalThis as any).fetch = fetch;

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiter
app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
}));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/protected", protectedRoutes);
app.use("/api/health", healthRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  // Optional health check
  fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY || ''
    }
  })
    .then((res: any) => console.log("🔍 Supabase health check status:", res.status))
    .catch((err: any) => console.error("❌ Supabase health check error:", err.message));
});
