import { config } from "@/backend/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/backend/db/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: config.dbUrl,
  },
});
