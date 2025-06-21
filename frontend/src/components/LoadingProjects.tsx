"use client"

import { useTranslation } from "next-i18next"

export default function LoadingProjects() {
    const { t } = useTranslation()

    return <div>{t("ui.loadingProjects")}</div>
}
