export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window === "undefined") return

    try {
        if (window.rybbit && window.rybbit.event) {
            window.rybbit.event(eventName, properties)
        }
    } catch (error) {
        console.error("Tracking error:", error)
    }
}

export const trackPageview = () => {
    if (typeof window === "undefined") return

    try {
        if (window.rybbit && window.rybbit.pageview) {
            window.rybbit.pageview()
        }
    } catch (error) {
        console.error("Tracking error:", error)
    }
}
