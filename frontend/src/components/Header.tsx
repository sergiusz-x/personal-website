"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { usePathname, useRouter } from "next/navigation"
import { trackEvent } from "../utils/tracking"
import { skipNextPageview } from "../utils/rybbit-wrapper"

export default function Header() {
    const { t, i18n } = useTranslation()
    // track image load error for language flag
    const [imgError, setImgError] = useState(false) // reset error when language changes
    useEffect(() => {
        setImgError(false)
    }, [i18n.language])

    const pathname = usePathname()
    const router = useRouter() // mobile menu state
    const [menuOpen, setMenuOpen] = useState(false)
    const toggleMenu = () => setMenuOpen(prev => !prev)
    const ChangeLanguage = () => {
        const newLanguage = i18n.language === "en" ? "pl" : "en"

        trackEvent("language_switch", {
            from: i18n.language,
            to: newLanguage
        })

        try {
            // Skip next pageview to prevent duplicate tracking
            skipNextPageview()

            i18n.changeLanguage(newLanguage)
            if (pathname) {
                const newPath = `/${newLanguage}${pathname.substring(3)}`
                router.push(newPath)
            } else {
                console.error("Pathname is null, cannot change language.")
            }
        } catch (error) {
            console.error("Failed to change language", error)
        }
    }

    return (
        <header className="py-4 relative">
            <nav className="container mx-auto px-4 flex justify-end space-x-8 relative">
                {/* desktop links */}
                <div className="hidden md:flex space-x-8">
                    <button
                        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                        className="nav-link text-white font-semibold text-lg uppercase pb-2 hover:text-blue transition-colors duration-300"
                    >
                        {t("header.about")}
                    </button>
                    <button
                        onClick={() => document.getElementById("techstack")?.scrollIntoView({ behavior: "smooth" })}
                        className="nav-link text-white font-semibold text-lg uppercase pb-2 hover:text-blue transition-colors duration-300"
                    >
                        {t("header.tech-stack")}
                    </button>
                    <button
                        onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                        className="nav-link text-white font-semibold text-lg uppercase pb-2 hover:text-blue transition-colors duration-300"
                    >
                        {t("header.projects")}
                    </button>
                    <button
                        onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                        className="nav-link text-white font-semibold text-lg uppercase pb-2 hover:text-blue transition-colors duration-300"
                    >
                        {t("header.contact")}
                    </button>
                    <button
                        onClick={ChangeLanguage}
                        aria-label={i18n.language === "en" ? t("ui.switchToPolish") : t("ui.switchToEnglish")}
                        className="nav-link inline-flex items-center justify-center text-white font-semibold text-lg uppercase pb-2 hover:text-blue transition-colors duration-300 w-10"
                    >
                        {i18n.language === "en" ? (
                            imgError ? (
                                t("ui.polishFlag")
                            ) : (
                                <Image
                                    src="https://flagcdn.com/20x15/pl.png"
                                    alt={t("ui.switchToPolish")}
                                    width={20}
                                    height={15}
                                    onError={() => setImgError(true)}
                                />
                            )
                        ) : imgError ? (
                            t("ui.englishFlag")
                        ) : (
                            <Image
                                src="https://flagcdn.com/20x15/gb.png"
                                alt={t("ui.switchToEnglish")}
                                width={20}
                                height={15}
                                onError={() => setImgError(true)}
                            />
                        )}
                    </button>
                </div>
                {/* mobile hamburger toggle */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white focus:outline-none"
                    aria-label={t("ui.toggleMenu")}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </nav>
            {/* mobile dropdown menu with overlay */}
            {menuOpen && (
                <div className="md:hidden fixed inset-0 z-50" onClick={() => setMenuOpen(false)}>
                    {/* side drawer */}
                    <div
                        className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-black bg-opacity-90 p-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex flex-col space-y-4">
                            <button
                                onClick={() => {
                                    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                                    setMenuOpen(false)
                                }}
                                className="text-white uppercase text-left"
                            >
                                {t("header.about")}
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById("techstack")?.scrollIntoView({ behavior: "smooth" })
                                    setMenuOpen(false)
                                }}
                                className="text-white uppercase text-left"
                            >
                                {t("header.tech-stack")}
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                                    setMenuOpen(false)
                                }}
                                className="text-white uppercase text-left"
                            >
                                {t("header.projects")}
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                                    setMenuOpen(false)
                                }}
                                className="text-white uppercase text-left"
                            >
                                {t("header.contact")}
                            </button>
                            <button
                                onClick={() => {
                                    ChangeLanguage()
                                    setMenuOpen(false)
                                }}
                                aria-label={i18n.language === "en" ? t("ui.switchToPolish") : t("ui.switchToEnglish")}
                                className="text-white uppercase inline-flex items-center"
                            >
                                {i18n.language === "en" ? (
                                    imgError ? (
                                        t("ui.polishFlag")
                                    ) : (
                                        <Image
                                            src="https://flagcdn.com/20x15/pl.png"
                                            alt={t("ui.polishFlag")}
                                            width={20}
                                            height={15}
                                            onError={() => setImgError(true)}
                                        />
                                    )
                                ) : imgError ? (
                                    t("ui.englishFlag")
                                ) : (
                                    <Image
                                        src="https://flagcdn.com/20x15/gb.png"
                                        alt={t("ui.englishFlag")}
                                        width={20}
                                        height={15}
                                        onError={() => setImgError(true)}
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
