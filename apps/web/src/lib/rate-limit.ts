import Redis from "ioredis"

// Use Redis if available, else no-op or in-memory map (not shared across lambdas)
const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null

export async function rateLimit(identifier: string, limit: number = 10, window: number = 60) {
    if (!redis) return true

    const key = `ratelimit:${identifier}`
    const current = await redis.incr(key)

    if (current === 1) {
        await redis.expire(key, window)
    }

    return current <= limit
}
