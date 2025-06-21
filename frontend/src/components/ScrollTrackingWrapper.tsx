"use client"

import { useScrollTracking } from "../hooks/useScrollTracking"
import { useErrorAndPerformanceTracking } from "../hooks/useErrorAndPerformanceTracking"
import { trackEvent } from "../utils/tracking"
import { useEffect } from "react"

interface ScrollTrackingWrapperProps {
    children: React.ReactNode
}

export default function ScrollTrackingWrapper({ children }: ScrollTrackingWrapperProps) {
    const sectionIds = ["hero", "about", "techstack", "projects", "contact"]

    const { viewedPercentage } = useScrollTracking(sectionIds, {
        threshold: 0.3,
        trackOnce: true
    })

    // Initialize error and performance tracking
    useErrorAndPerformanceTracking()
    useEffect(() => {
        if (viewedPercentage === 100) {
            // Track when user has viewed all sections
            trackEvent("portfolio_fully_viewed", {
                total_sections: sectionIds.length,
                completion_time: Date.now(),
                engagement_level: "high"
            })
        }
    }, [viewedPercentage, sectionIds.length])

    return <>{children}</>
}
