import { Request, Response, NextFunction } from "express"
import { send_error_to_webhook } from "../services/discord_service"
import logger from "../utils/logger"

export default (err: Error & { status?: number; type?: string }, req: Request, res: Response, next: NextFunction) => {
    logger.error("An error occurred:", err)

    // Handle different types of errors
    if (err.type === "validation") {
        res.status(400).json({ message: err.message || "Validation Error" })
        return
    }

    if (err.type === "authorization") {
        res.status(403).json({ message: err.message || "Authorization Error" })
        return
    }

    if (err.status) {
        res.status(err.status).json({ message: err.message || "Error" })
        return
    }

    // Handle general errors
    send_error_to_webhook(err)

    res.status(500).json({
        message: "Internal Server Error"
    })
}
