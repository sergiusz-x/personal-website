/** @type {import('next').NextConfig} */
const nextConfig = {
    // Bundle optimization
    compiler: {
        removeConsole: process.env.NODE_ENV === "production"
    },
    async rewrites() {
        return [
            {
                source: "/",
                destination: "/en"
            }
        ]
    },
    productionBrowserSourceMaps: false,
    async headers() {
        return [
            {
                source: "/_next/static/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable"
                    }
                ]
            },
            {
                source: "/favicon.ico",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable"
                    }
                ]
            },
            {
                source: "/(.*).png",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable"
                    }
                ]
            },
            {
                source: "/(.*).jpg",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable"
                    }
                ]
            },
            {
                source: "/(.*).jpeg",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable"
                    }
                ]
            },
            {
                source: "/(.*).svg",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable"
                    }
                ]
            },
            {
                source: "/(.*).webp",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable"
                    }
                ]
            },
            {
                source: "/api/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "no-cache, no-store, must-revalidate"
                    }
                ]
            }
        ]
    },
    images: {
        formats: ["image/webp", "image/avif"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "flagcdn.com"
            }
        ]
    },
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ["react-icons", "@uiw/react-markdown-preview"]
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false
            }
        }

        // Tree shaking optimization
        config.optimization = {
            ...config.optimization,
            usedExports: true,
            sideEffects: false
        }

        return config
    }
}

module.exports = nextConfig
