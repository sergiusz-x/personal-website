import rate_limit from "express-rate-limit"
import slow_down from "express-slow-down"
import logger from "../utils/logger"
import { Request, Response } from "express"

export const apiLimiter = rate_limit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: "Too many requests, please try again later.",
    handler: (req: Request, res: Response) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`)
        res.status(429).json({ message: "Too many requests, please try again later." })
    }
})

export const contactLimiter = rate_limit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: "Too many contact form submissions, please try again later.",
    handler: (req: Request, res: Response) => {
        logger.warn(`Rate limit exceeded for contact form from IP: ${req.ip}`)
        res.status(429).json({ message: "Too many contact form submissions, please try again later." })
    }
})

export const speedLimiter = slow_down({
    windowMs: 15 * 60 * 1000,
    delayAfter: 100,
    delayMs: () => 500
})

logger.info("Rate limit middleware initialized")
