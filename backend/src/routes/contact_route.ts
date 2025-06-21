import { Request, Response, NextFunction } from "express"
import { send_contact_to_webhook } from "../services/discord_service"
import { verify_captcha } from "../utils/cloudflare_captcha"
import logger from "../utils/logger"
import { z } from "zod"
//
interface RequestBody {
    name: string
    email: string
    message: string
    captcha_token: string
}
//
const contactSchema = z.object({
    name: z.string().min(1, "Name is required").max(256, "Name is too long"),
    email: z.string().email("Invalid email address").max(256, "Email is too long"),
    message: z.string().min(1, "Message is required").max(1500, "Message is too long"),
    captcha_token: z.string().min(1, "CAPTCHA token is required")
})
//
export const post_contact = async (
    req: Request<{}, {}, RequestBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    logger.info("Received contact form submission")
    let { name, email, message, captcha_token } = req.body
    logger.info(`Contact form data: Name: ${name}, Email: ${email}, Message: ${message}`)
    //
    try {
        contactSchema.parse(req.body)
    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationErrors = error.errors.map(err => err.message).join(", ")
            logger.error(`Validation failed: ${validationErrors}`)
            res.status(400).json({ message: validationErrors })
            return
        }
    } //
    if (!(await verify_captcha(captcha_token))) {
        logger.error("CAPTCHA verification failed")
        res.status(400).json({ message: "Invalid captcha" })
        return
    }
    //
    const message_sent = await send_contact_to_webhook({
        name,
        email,
        message
    })
    //
    if (message_sent) {
        res.status(200).json({ message: "Message sent successfully" })
    } else {
        res.status(500).json({ message: "Message not sent" })
    }
    logger.info("Contact form submission processed successfully")
}
