"use client"

import Script from "next/script"
import { initRybbitWrapper } from "../utils/rybbit-wrapper"

export default function TrackingScript() {
    return (
        <Script
            src={process.env.NEXT_PUBLIC_TRACKING_URL}
            data-site-id={process.env.NEXT_PUBLIC_TRACKING_SITE_ID}
            data-track-spa="false"
            data-track-outbound="false"
            strategy="afterInteractive"
            onLoad={() => {
                initRybbitWrapper()
            }}
        />
    )
}
