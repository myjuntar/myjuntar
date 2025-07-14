// apps/backend/src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = parseInt(process.env.PORT || '3001', 10);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  // Optional Supabase health check
  const fetch = require('node-fetch');
  (globalThis as any).fetch = fetch;

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      headers: { apikey: process.env.SUPABASE_SERVICE_KEY }
    })
      .then((res: any) => console.log("🔍 Supabase health check status:", res.status))
      .catch((err: any) => console.error("❌ Supabase health check error:", err.message));
  }
});

// Graceful shutdown and error handlers
process.on('SIGTERM', () => {
  console.info('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    console.log('💤 Closed out remaining connections.');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
  process.exit(1);
});
