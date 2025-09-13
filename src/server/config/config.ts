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
    this.dbUrl = `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`;
    this.sessionSecret = config.SESSION_SECRET;
    this.isProduction = config.NODE_ENV === "production";

    ConfigInstance[instance] = this;
  }

  private envSchema = z.object({
    // for db
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DB: z.string().min(1),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PORT: z.coerce.number().min(1).default(5432),

    // for app
    SESSION_SECRET: z.string().min(32),
    NODE_ENV: z.enum(["development", "production"]).default("production"),
    PORT: z.coerce.number().default(8080),
  });

  private parse(data: unknown) {
    const parseResult = this.envSchema.safeParse(data);
    if (parseResult.success) {
      return parseResult.data;
    }

    const message = parseResult.error.issues.reduce(
      (acc, { path, message }) =>
        acc + "\n" + `[${path.join(".")}]: ${message}`,
      "Errors found while parsing environment:"
    );

    throw new Error(message);
  }
}

export const config = new ConfigInstance();
