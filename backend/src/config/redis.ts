import Redis from "ioredis";
import { env } from "./env";
import { logger } from "./logger";

export const redis = env.redisUrl
  ? new Redis(env.redisUrl)
  : new Redis();

redis.on("error", (error) => {
  logger.error(`Redis error: ${error.message}`);
});
