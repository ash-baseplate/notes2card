import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_Xma8qSRY7hlv@ep-gentle-grass-a4qdd5da-pooler.us-east-1.aws.neon.tech/notes2card?sslmode=require&channel_binding=require',
  },
});
