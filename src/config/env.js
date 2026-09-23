// Loads .env into process.env and validates it once at startup, so a
// missing or malformed value fails fast here instead of surfacing later as
// a confusing runtime error. Same pattern as the support desk case study's
// config/env.js — only PORT is validated for now because nothing else is
// used yet. Add fields here (DATABASE_URL, REDIS_HOST/PORT, MAIL_HOST/PORT,
// JWT_SECRET, ...) as your own case study starts needing them.
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const problems = result.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment configuration — ${problems}`);
}

export default result.data;
