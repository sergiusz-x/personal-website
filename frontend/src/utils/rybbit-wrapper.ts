export const initRybbitWrapper = () => {
    if (typeof window === "undefined") return // Wait for rybbit to be fully loaded
    const checkRybbit = () => {
        if (!window.rybbit?.pageview) {
            setTimeout(checkRybbit, 100)
            return
        }

        // Store original pageview function
        const originalPageview = window.rybbit.pageview

        // Override pageview function to check for skip flag
        window.rybbit.pageview = () => {
            if (window.skipNextPageview) {
                window.skipNextPageview = false
                return
            }
            originalPageview.call(window.rybbit)
        }
    }

    checkRybbit()
}

// Function to skip next pageview (for language changes)
export const skipNextPageview = () => {
    if (typeof window !== "undefined") {
        window.skipNextPageview = true
    }
}
