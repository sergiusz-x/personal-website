import "../globals.css"
import { redirect } from "next/navigation"
import LanguageProvider from "../../components/LanguageProvider"
import DottedBackground from "../../components/DottedBackground"
import ErrorBoundary from "../../components/ErrorBoundary"
import TrackingScript from "../../components/TrackingScript"
import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
    themeColor: "#168DC8"
}

export const metadata: Metadata = {
    title: "sergiusz.dev",
    description: "Personal portfolio of Sergiusz – full-stack developer",
    keywords:
        "sergiusz, full-stack developer, web developer, node.js, typescript, javascript, backend, frontend, portfolio",
    authors: [{ name: "sergiusz-x", url: "https://github.com/sergiusz-x/" }],
    openGraph: {
        title: "sergiusz.dev",
        description: "Personal portfolio of Sergiusz – full-stack developer",
        type: "website",
        url: "https://sergiusz.dev",
        images: [
            {
                url: "https://sergiusz.dev/android-chrome-512x512.png",
                width: 512,
                height: 512,
                alt: "sergiusz.dev logo"
            }
        ]
    },
    twitter: {
        card: "summary",
        title: "sergiusz.dev",
        description: "Personal portfolio of Sergiusz – full-stack developer",
        images: ["https://sergiusz.dev/android-chrome-512x512.png"]
    },
    robots: "index, follow",
    alternates: {
        canonical: "https://sergiusz.dev"
    },
    manifest: "/manifest.json",
    icons: {
        icon: [
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
        ],
        apple: "/apple-touch-icon.png"
    },
    other: {
        "msapplication-TileColor": "#201f1f"
    }
}

export default async function Layout(props: { children: React.ReactNode; params: Promise<{ lng: string }> }) {
    const params = await props.params

    const { children } = props

    const { lng } = params || {}

    // Language validation
    if (!lng || !["en", "pl"].includes(lng)) {
        redirect("/en")
        return null
    }
    return (
        <html lang={lng} className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://flagcdn.com" />
                <link rel="dns-prefetch" href="https://sergiusz.dev" />
                <TrackingScript />
            </head>
            <body className="relative text-white min-h-screen">
                <noscript>
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                        <p className="text-white text-center px-4">
                            JavaScript is disabled. This site requires JavaScript to function properly.
                        </p>
                    </div>
                </noscript>
                <DottedBackground />
                <div className="relative z-10">
                    <ErrorBoundary>
                        <LanguageProvider lng={lng}>{children}</LanguageProvider>
                    </ErrorBoundary>
                </div>
            </body>
        </html>
    )
}
