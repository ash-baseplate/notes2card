import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './configs/schema.js',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_qQbxkHr3cD8E@ep-soft-wave-ai1ogtdy-pooler.c-4.us-east-1.aws.neon.tech/notes2card?sslmode=require&channel_binding=require',
  },
});
