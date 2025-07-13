// apps/backend/src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load from .env manually
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Supabase environment variables missing!");
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
