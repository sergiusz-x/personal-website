"use client"

import { Button } from "./ui/button"
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "next-i18next"

export default function Hero() {
    const { t } = useTranslation()

    let texts: string[] = []
    try {
        texts = t("hero.texts", { returnObjects: true }) as unknown as string[]
    } catch (error) {
        console.error("Translation error in Hero component", error)
        texts = ["Default text"]
    }

    const [currentTextIndex, setCurrentTextIndex] = useState(0)
    const [animationClass, setAnimationClass] = useState("animate-slide-in")

    useEffect(() => {
        const intervalId = setInterval(() => {
            setAnimationClass("animate-slide-out")
            setTimeout(() => {
                setCurrentTextIndex(prevIndex => (prevIndex + 1) % texts.length)
                setAnimationClass("animate-slide-in")
            }, 500)
        }, 3000)

        return () => clearInterval(intervalId)
    }, [texts.length])

    const waveRef = useRef<HTMLSpanElement>(null)
    const handleMouseEnter = () => {
        if (waveRef.current) {
            waveRef.current.style.transition = ""
            waveRef.current.style.animation = "wave 0.6s ease-in-out infinite"
        }
    }
    const handleMouseLeave = () => {
        if (waveRef.current) {
            const el = waveRef.current
            //
            const currentTransform = window.getComputedStyle(el).transform
            //
            el.style.animation = ""
            //
            el.style.transform = currentTransform
            el.style.transition = "transform 0.3s ease-out"
            requestAnimationFrame(() => {
                el.style.transform = "rotate(0deg)"
            })
        }
    }
    return (
        <section id="hero" className="py-20 px-4 sm:px-8 select-none">
            <h1
                className="inline-block text-4xl sm:text-6xl font-bold mb-4"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {t("hero.greeting")}
                <span ref={waveRef} className="wave-emoji">
                    👋
                </span>
            </h1>
            <div className="flex items-center justify-center overflow-visible min-h-[3.5rem] mb-6 w-full">
                <p className={`${animationClass} text-xl sm:text-2xl text-blue w-full break-words whitespace-normal`}>
                    {texts[currentTextIndex]}
                </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                    variant="convexconcave"
                    size="rounded"
                    className="w-full sm:w-auto"
                    onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                >
                    {t("hero.projectsButton")}
                </Button>
                <Button
                    variant="convexconcave"
                    size="rounded"
                    className="w-full sm:w-auto"
                    onClick={() => document.getElementById("socials")?.scrollIntoView({ behavior: "smooth" })}
                >
                    {t("hero.socialsButton")}
                </Button>
            </div>
        </section>
    )
}
