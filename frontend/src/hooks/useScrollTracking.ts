"use client"

import { useEffect, useState, useRef } from "react"
import { trackEvent } from "../utils/tracking"

interface ScrollTrackingOptions {
    threshold?: number // Percentage of element visible to trigger tracking (0-1)
    trackOnce?: boolean // Track only once per section
}

export const useScrollTracking = (
    sectionIds: string[],
    options: ScrollTrackingOptions = { threshold: 0.5, trackOnce: true }
) => {
    const [viewedSections, setViewedSections] = useState<Set<string>>(new Set())
    const observerRef = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
        const elements = sectionIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]

        if (elements.length === 0) return

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const sectionId = entry.target.id

                    if (entry.isIntersecting && entry.intersectionRatio >= (options.threshold || 0.5)) {
                        if (!options.trackOnce || !viewedSections.has(sectionId)) {
                            trackEvent("section_viewed", {
                                section: sectionId,
                                intersection_ratio: Math.round(entry.intersectionRatio * 100) / 100
                            })

                            setViewedSections(prev => new Set([...prev, sectionId]))
                        }
                    }
                })
            },
            {
                threshold: options.threshold || 0.5,
                rootMargin: "0px"
            }
        )

        elements.forEach(element => observer.observe(element))
        observerRef.current = observer

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [sectionIds, options.threshold, options.trackOnce, viewedSections])

    return {
        viewedSections: Array.from(viewedSections),
        totalSections: sectionIds.length,
        viewedPercentage: Math.round((viewedSections.size / sectionIds.length) * 100)
    }
}
