"use client"

import { useTranslation } from "next-i18next"

export default function About() {
    const { t } = useTranslation()

    return (
        <section id="about" className="py-20">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue">{t("about.title")}</h2>
            <div className="max-w-4xl mx-auto bg-black p-8 rounded-3xl shadow-convex hover:shadow-concave active:shadow-concave_clicked transition-all duration-100">
                <p className="text-lg text-white whitespace-pre-line text-justify leading-relaxed">
                    {t("about.description")}
                </p>
            </div>
        </section>
    )
}
