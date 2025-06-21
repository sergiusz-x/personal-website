"use client"

import dynamic from "next/dynamic"

const CustomCursor = dynamic(() => import("./CustomCursor"), {
    ssr: false,
    loading: () => null
})

const ScrollTrackingWrapper = dynamic(() => import("./ScrollTrackingWrapper"), {
    ssr: false,
    loading: () => <div className="contents">{/* Placeholder */}</div>
})

export default function ClientComponents({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CustomCursor />
            <ScrollTrackingWrapper>{children}</ScrollTrackingWrapper>
        </>
    )
}
