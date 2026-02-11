import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './configs/schema.js',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_CHfv68JZqMXy@ep-weathered-cake-aimczuwz-pooler.c-4.us-east-1.aws.neon.tech/notes2card_db?sslmode=require&channel_binding=require',
  },
});
