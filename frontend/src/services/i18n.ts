import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"

import enTranslations from "../locales/en.json"
import plTranslations from "../locales/pl.json"

const resources = {
    en: {
        common: enTranslations
    },
    pl: {
        common: plTranslations
    }
}

if (!i18n.isInitialized) {
    i18n.use(Backend)
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources,
            ns: ["common"],
            defaultNS: "common",
            fallbackLng: "en",
            supportedLngs: ["en", "pl"],
            interpolation: {
                escapeValue: false
            },
            detection: {
                order: ["path", "cookie", "localStorage", "navigator"],
                caches: ["localStorage", "cookie"]
            },
            react: {
                useSuspense: false
            }
        })
}

export default i18n
