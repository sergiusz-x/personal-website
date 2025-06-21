import { EmbedBuilder, WebhookClient } from "discord.js"
import logger from "../utils/logger"
//
if (!process.env.DISCORD_WEBHOOK_URL_ERRORS || !process.env.DISCORD_WEBHOOK_URL_CONTACT) {
    throw new Error("Webhook URLs are not defined in environment variables")
}
//
const webhook_error = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL_ERRORS })
const webhook_contact = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL_CONTACT })
//
export function send_error_to_webhook(error: Error) {
    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("New Backend Error")
        .setTimestamp()
        .setDescription(`**Error:** ${error.message}\n**Stack:**\n\`\`\`${error.stack}\`\`\``)
    //
    webhook_error.send({ embeds: [embed] }).catch(err => {
        logger.error(`Failed to send error to Discord webhook: ${err.message}`)
    })
}
//
export async function send_contact_to_webhook(form_data: { name: string; email: string; message: string }) {
    try {
        const { name, email, message } = form_data
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("New Contact")
            .setTimestamp()
            .setDescription(`**Name:** ${name}\n**Email:** ${email}\n**Message:**\n\`\`\`${message}\`\`\``)
        //
        await webhook_contact.send({ embeds: [embed], content: `@everyone New contact from \`${name}\`` })
        return true
    } catch (err) {
        logger.error(
            `Failed to send contact to Discord webhook: ${err instanceof Error ? err.message : "Unknown error"}`
        )
        return false
    }
}
