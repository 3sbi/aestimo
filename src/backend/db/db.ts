import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "../config";

export const db = drizzle({
  connection: config.dbUrl,
  casing: "snake_case",
});
