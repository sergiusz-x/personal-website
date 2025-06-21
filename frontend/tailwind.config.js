import animate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                lato: ["Lato", "sans-serif"]
            },
            colors: {
                blue: "#168DC8",
                white: "#E8E9F3",
                black: "#201f1f",
                canvasBackgroundStart: "#201f1f",
                canvasBackgroundEnd: "#2a2b2b",
                markdown_background: "#0D1117",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))"
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))"
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))"
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))"
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))"
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))"
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))"
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))"
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)"
            },
            boxShadow: {
                convex: "2px 2px 2px 0px rgba(0, 0, 0, 0.25), -2px -2px 2px 0px rgba(232, 233, 243, 0.25)",
                concave: "-2px -2px 2px 0px rgba(232, 233, 243, 0.25) inset, 2px 2px 2px 0px rgba(0, 0, 0, 0.25) inset",
                concave_clicked:
                    "-3px -3px 3px 0px rgba(232, 233, 243, 0.25) inset, 3px 3px 3px 0px rgba(0, 0, 0, 0.25) inset"
            }
        }
    },
    plugins: [animate]
}
