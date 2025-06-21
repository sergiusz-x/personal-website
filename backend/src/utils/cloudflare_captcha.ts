import axios from "axios"
import logger from "./logger"
//
if (!process.env.CLOUDFLARE_SECRET_KEY) {
    throw new Error("No Cloudflare Secret Key set")
}
//
export const verify_captcha = async (captcha_token: string): Promise<boolean> => {
    try {
        const secret_key = process.env.CLOUDFLARE_SECRET_KEY
        const response = await axios.post(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, {
            secret: secret_key,
            response: captcha_token
        })

        if (response.data.success) {
            return true
        } else {
            logger.warn("CAPTCHA verification failed", {
                errorCodes: response.data["error-codes"]
            })
            return false
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            logger.error("CAPTCHA verification request failed", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            })
        } else {
            logger.error("Unexpected error during CAPTCHA verification", {
                error: error
            })
        }
        return false
    }
}
