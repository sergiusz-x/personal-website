"use client"

import { useLayoutEffect, useState } from "react"
import i18n from "../services/i18n"
import { I18nextProvider } from "react-i18next"

export default function LanguageProvider({ children, lng }: { children: React.ReactNode; lng: string }) {
    const [ready, setReady] = useState(false)
    useLayoutEffect(() => {
        i18n.changeLanguage(lng).then(() => setReady(true))
    }, [lng])

    if (!ready) return null
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
