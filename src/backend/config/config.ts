import "dotenv/config";
import { z } from "zod";

const instance = Symbol("config");

export class ConfigInstance {
  static [instance]: ConfigInstance;

  public readonly port!: number;
  public readonly dbUrl!: string;
  public readonly sessionSecret!: string;
  public readonly isProduction!: boolean;

  constructor() {
    if (ConfigInstance[instance]) return ConfigInstance[instance];

    const config = this.parse(process.env);

    this.port = config.PORT;
    this.dbUrl = config.DATABASE_URL;
    this.sessionSecret = config.SESSION_SECRET;
    this.isProduction = config.NODE_ENV === "production";

    ConfigInstance[instance] = this;
  }

  private envSchema = z.object({
    PORT: z.coerce.number().default(8080),
    DATABASE_URL: z.string().min(1),
    SESSION_SECRET: z.string().min(32),
    NODE_ENV: z.enum(["development", "production"]).default("production"),
  });

  private parse(data: unknown) {
    const parseResult = this.envSchema.safeParse(data);
    if (parseResult.success) return parseResult.data;

    const message = parseResult.error.issues.reduce(
      (acc, { path, message }) =>
        acc + "\n" + `[${path.join(".")}]: ${message}`,
      "Errors found while parsing environment:"
    );

    throw new Error(message);
  }
}

export const config = new ConfigInstance();
