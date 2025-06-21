"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { trackEvent } from "../utils/tracking"

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Track React component errors
        trackEvent("react_error", {
            message: error.message,
            stack: error.stack?.substring(0, 500),
            component_stack: errorInfo.componentStack?.substring(0, 500)
        })

        console.error("React Error Boundary caught an error:", error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-black text-white">
                    <div className="text-center p-8">
                        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
                        <p className="text-gray-400 mb-4">We`re sorry, but something unexpected happened.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
