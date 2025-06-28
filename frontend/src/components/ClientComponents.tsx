"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { handleUTMParameters } from "../utils/tracking"

const CustomCursor = dynamic(() => import("./CustomCursor"), {
    ssr: false,
    loading: () => null
})

const ScrollTrackingWrapper = dynamic(() => import("./ScrollTrackingWrapper"), {
    ssr: false,
    loading: () => <div className="contents">{/* Placeholder */}</div>
})

export default function ClientComponents({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Handle UTM parameters on page load - ensure DOM is ready
        const handleUTM = () => {
            try {
                handleUTMParameters()
            } catch (error) {
                console.error("Error handling UTM parameters:", error)
            }
        }

        // Check if DOM is already loaded
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", handleUTM)
        } else {
            // DOM is already ready
            setTimeout(handleUTM, 100)
        }

        // Cleanup
        return () => {
            document.removeEventListener("DOMContentLoaded", handleUTM)
        }
    }, [])

    return (
        <>
            <CustomCursor />
            <ScrollTrackingWrapper>{children}</ScrollTrackingWrapper>
        </>
    )
}
