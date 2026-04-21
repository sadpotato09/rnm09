import Redis, { type RedisOptions } from "ioredis";
import { env } from "./env";

const globalForRedis = globalThis as unknown as {
  redis?: Redis | null;
  redisSub?: Redis;
};

/** Parse Redis URL with new URL() instead of the deprecated url.parse() */
function parseRedisUrl(rawUrl: string): RedisOptions {
  try {
    const u = new URL(rawUrl);
    return {
      host: u.hostname,
      port: u.port ? parseInt(u.port, 10) : 6379,
      password: u.password ? decodeURIComponent(u.password) : undefined,
      username: u.username ? decodeURIComponent(u.username) : undefined,
      db: u.pathname && u.pathname.length > 1 ? parseInt(u.pathname.slice(1), 10) || 0 : 0,
      tls: u.protocol === "rediss:" ? {} : undefined,
    };
  } catch {
    // Fallback: return the raw URL so ioredis can attempt its own parsing
    return { host: rawUrl };
  }
}

function createClient(): Redis | null {
  try {
    const client = new Redis({
      ...parseRedisUrl(env.REDIS_URL),
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      connectTimeout: 3000,
    });
    client.on("error", () => {});
    return client;
  } catch {
    return null;
  }
}

export const redis: Redis | null =
  globalForRedis.redis !== undefined
    ? globalForRedis.redis
    : (globalForRedis.redis = createClient());

export function makeSubscriber(): Redis | null {
  try {
    const client = new Redis({
      ...parseRedisUrl(env.REDIS_URL),
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });
    client.on("error", () => {});
    return client;
  } catch {
    return null;
  }
}

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  if (!redis) return loader();
  try {
    const hit = await redis.get(key);
    if (hit) {
      try {
        return JSON.parse(hit) as T;
      } catch {
        // corrupt cache — fall through
      }
    }
    const value = await loader();
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds).catch(() => {});
    return value;
  } catch {
    return loader();
  }
}

export function feedChannel(mint: string) {
  return `feed:${mint}`;
}
