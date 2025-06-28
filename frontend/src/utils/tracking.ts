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

// Function to handle UTM parameters - waits for Rybbit to capture them, then removes from URL
export const handleUTMParameters = () => {
    if (typeof window === "undefined" || !window.location || !window.location.href) return

    try {
        const url = new URL(window.location.href)
        const hasUTMParams = Array.from(url.searchParams.keys()).some(key => key && key.startsWith("utm_"))

        if (!hasUTMParams) return

        // Wait for Rybbit to be loaded and capture the UTM parameters
        const waitForRybbitAndCleanURL = () => {
            if (window.rybbit && typeof window.rybbit.pageview === "function") {
                // Give Rybbit a moment to capture the UTM parameters
                setTimeout(() => {
                    try {
                        // Remove UTM parameters from URL
                        const newUrl = new URL(window.location.href)
                        const paramsToRemove = Array.from(newUrl.searchParams.keys()).filter(
                            key => key && key.startsWith("utm_")
                        )

                        paramsToRemove.forEach(param => {
                            if (param) {
                                newUrl.searchParams.delete(param)
                            }
                        })

                        // Update URL without page reload
                        window.history.replaceState({}, document.title, newUrl.toString())
                    } catch (error) {
                        console.error("Error cleaning UTM parameters:", error)
                    }
                }, 200) // Increased delay to ensure Rybbit captures the parameters
            } else {
                // Retry if Rybbit is not ready yet
                setTimeout(waitForRybbitAndCleanURL, 100)
            }
        }

        waitForRybbitAndCleanURL()
    } catch (error) {
        console.error("Error handling UTM parameters:", error)
    }
}
