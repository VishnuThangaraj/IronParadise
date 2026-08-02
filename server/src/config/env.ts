import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

const env = {
  PORT: Number(process.env.PORT) || 5000,

  PROJECT_VERSION: required("PROJECT_VERSION"),

  CLIENT_ORIGIN: required("CLIENT_ORIGIN"),

  MONGO_URI: required("MONGO_URI"),

  JWT_SECRET: required("JWT_SECRET"),

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "1d",

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET + "_refresh",

  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
};

export default env;
