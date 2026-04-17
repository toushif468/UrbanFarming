import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // max 10 requests per 15 min
    message: {
        success: false,
        message: "Too many requests, please try again later.",
        data: null
    }
})