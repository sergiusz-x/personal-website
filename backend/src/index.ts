import express from "express"
import http from "http"
import https from "https"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import cors from "cors"
//
dotenv.config()
//
import { apiLimiter, contactLimiter, speedLimiter } from "./middlewares/rate_limit"
import { get_projects } from "./routes/project_route"
import { post_contact } from "./routes/contact_route"
import error_handler from "./middlewares/error_handler"
import logger from "./utils/logger"
//
const app = express()
const port_http = process.env.PORT_HTTP || 8000
const port_https = process.env.PORT_HTTPS || 8001
//
// Trust proxy for Cloudflare
app.set("trust proxy", 1)
//
// Middlewares
app.use(express.json())
app.use(apiLimiter)
app.use(speedLimiter)
app.use(
    cors({
        methods: ["GET", "POST"]
    })
)
//
// Services
import "./services/discord_service"
import "./services/github_service"
//
// Routes
app.get("/api/projects", get_projects)
app.post("/api/contact", contactLimiter, post_contact)
//
// Error handling
app.use(error_handler)
//
// HTTP
if (port_http && port_http !== "0") {
    const http_server = http.createServer(app)
    http_server.listen(port_http, () => {
        logger.info(`HTTP Server running on port ${port_http}`)
    })
}
//
// HTTPS
if (port_https && port_https !== "0") {
    const sslOptions = {
        key: fs.readFileSync(path.resolve(__dirname, "./certs/key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "./certs/cert.pem"))
    }
    const https_server = https.createServer(sslOptions, app)
    https_server.listen(port_https, () => {
        logger.info(`HTTPS Server running on port ${port_https}`)
    })
}
