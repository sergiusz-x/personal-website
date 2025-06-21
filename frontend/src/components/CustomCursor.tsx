"use client"
import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"

const CustomCursor: React.FC = () => {
    // detect mobile/touch devices to disable custom cursor
    const isMobile =
        typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
    const [hoverLink, setHoverLink] = useState(false)

    // Hide default cursor globally via injected CSS
    useEffect(() => {
        const styleEl = document.createElement("style")
        styleEl.id = "custom-cursor-hide"
        styleEl.innerHTML = `*, *::before, *::after { cursor: none !important; }`
        document.head.appendChild(styleEl)
        return () => {
            document.getElementById("custom-cursor-hide")?.remove()
        }
    }, [])

    // Track mouse movement
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX
            const y = e.clientY
            // Update cursor position
            setCursorPos({ x, y })
            // Detect interactive elements by tag, role, or utility class
            const targetEl = e.target as HTMLElement
            const interactive = Boolean(
                targetEl.closest("a, button, input, textarea, select, label, [role='button'], .cursor-pointer")
            )
            setHoverLink(interactive)
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [])

    // On mobile/touch disable
    if (isMobile) return null
    // Render only the main cursor dot
    return createPortal(
        <div
            style={{
                position: "fixed",
                top: cursorPos.y,
                left: cursorPos.x,
                width: "12px",
                height: "12px",
                backgroundColor: hoverLink ? "#168DC8" : "white",
                border: hoverLink ? "2px solid white" : "none",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                transition: "background-color 0.2s ease, border 0.2s ease",
                zIndex: 2147483647
            }}
        />,
        document.body
    )
}

export default CustomCursor
