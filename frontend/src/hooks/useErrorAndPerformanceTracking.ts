"use client"

import { useEffect } from "react"
import { trackEvent } from "../utils/tracking"

export const useErrorAndPerformanceTracking = () => {
    useEffect(() => {
        // Global JavaScript error handler
        const handleError = (event: ErrorEvent) => {
            // Skip generic "Script error" from CORS issues
            if (event.message === "Script error." && !event.filename) {
                return // Don't track generic CORS errors
            }

            trackEvent("javascript_error", {
                message: event.message || "Unknown error",
                filename: event.filename || "unknown",
                line: event.lineno || 0,
                column: event.colno || 0,
                stack: event.error?.stack?.substring(0, 500) || "no stack trace",
                user_agent: navigator.userAgent.substring(0, 200),
                url: window.location.href
            })
        }

        // Promise rejection handler
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            trackEvent("promise_rejection", {
                reason: String(event.reason).substring(0, 500)
            })
        }

        // Add event listeners
        window.addEventListener("error", handleError)
        window.addEventListener("unhandledrejection", handleUnhandledRejection)

        // Cleanup
        return () => {
            window.removeEventListener("error", handleError)
            window.removeEventListener("unhandledrejection", handleUnhandledRejection)
        }
    }, [])
}
