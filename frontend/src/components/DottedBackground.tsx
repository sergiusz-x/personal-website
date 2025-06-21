"use client"
import React, { useEffect, useRef } from "react"

interface CursorTrailProps {
    className?: string
}

const DottedBackground: React.FC<CursorTrailProps> = ({ className = "" }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let lastX: number | null = null
        let lastY: number | null = null
        let currentRepelRadius = 150
        let targetRepelRadius = 150
        const baseRepelRadius = 150
        const extraRepelRadius = -50

        function animateRadius() {
            const speed = 0.2 // Animation speed
            const diff = targetRepelRadius - currentRepelRadius
            if (Math.abs(diff) > 0.5) {
                currentRepelRadius += diff * speed
            } else {
                currentRepelRadius = targetRepelRadius
            }
        }

        function resize() {
            if (!canvas || !ctx) return
            const w = window.innerWidth
            const h = window.innerHeight
            const dpr = window.devicePixelRatio || 1
            canvas.width = w * dpr
            canvas.height = h * dpr
            canvas.style.width = `${w}px`
            canvas.style.height = `${h}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            drawDotGrid(25, 1.5, "rgba(255,255,255,0.1)", lastX, lastY, currentRepelRadius)
        }

        function drawDotGrid(
            spacing = 25,
            size = 1.5,
            color = "rgba(255,255,255,0.1)",
            cursorX: number | null = null,
            cursorY: number | null = null,
            repelRadius = 150
        ) {
            const dpr = window.devicePixelRatio || 1
            if (!ctx || !canvas) return
            // clear previous frame
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const width = canvas.width / dpr
            const height = canvas.height / dpr

            // offset for scroll effect
            const offsetY = window.scrollY % spacing

            for (let x = 0; x < width; x += spacing) {
                for (let y = -spacing + offsetY; y < height + spacing; y += spacing) {
                    let dx = 0
                    let dy = 0

                    // Calculate displacement for dots within the repel radius
                    if (cursorX !== null && cursorY !== null) {
                        const distance = Math.hypot(x - cursorX, y - cursorY)
                        if (distance < repelRadius) {
                            const angle = Math.atan2(y - cursorY, x - cursorX)
                            const strength = (repelRadius - distance) / repelRadius
                            dx = Math.cos(angle) * strength * spacing
                            dy = Math.sin(angle) * strength * spacing
                        }
                    }

                    ctx.beginPath()
                    ctx.arc(x + dx, y + dy, size, 0, Math.PI * 2)
                    ctx.fillStyle = color
                    ctx.fill()
                }
            }
        }

        // Full-screen canvas setup
        window.addEventListener("resize", resize)
        // Initial sizing and grid draw
        resize()

        // Track mouse for repulsion
        const handleMouse = (e: MouseEvent) => {
            lastX = e.clientX
            lastY = e.clientY
        }

        const handleMouseDown = () => {
            targetRepelRadius = baseRepelRadius + extraRepelRadius
        }

        const handleMouseUp = () => {
            targetRepelRadius = baseRepelRadius
        }

        window.addEventListener("mousemove", handleMouse)
        window.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mouseup", handleMouseUp)

        // Continuous animation loop for smooth updates
        let rafId: number
        const animate = () => {
            animateRadius()
            drawDotGrid(25, 1.5, "rgba(255,255,255,0.1)", lastX, lastY, currentRepelRadius)
            rafId = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            window.removeEventListener("resize", resize)
            window.removeEventListener("mousemove", handleMouse)
            window.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mouseup", handleMouseUp)
            cancelAnimationFrame(rafId)
        }
    }, [])

    const baseClasses =
        "fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-canvasBackgroundStart to-canvasBackgroundEnd"
    return <canvas ref={canvasRef} className={`${baseClasses} ${className}`.trim()} />
}

export default DottedBackground
