import dynamic from "next/dynamic"
import Header from "../../components/Header"
import Hero from "../../components/Hero"
import ClientComponents from "../../components/ClientComponents"
import { fetch_projects } from "../../utils/fetch_projects"
import LoadingProjects from "../../components/LoadingProjects"

// Dynamic imports for code splitting
const About = dynamic(() => import("../../components/About"), {
    loading: () => <div className="py-16 text-center">Loading...</div>
})
const TechStack = dynamic(() => import("../../components/TechStack"), {
    loading: () => <div className="py-16 text-center">Loading...</div>
})
const Projects = dynamic(() => import("../../components/Projects"), {
    loading: () => <LoadingProjects />
})
const Contact = dynamic(() => import("../../components/Contact"), {
    loading: () => <div className="py-16 text-center">Loading...</div>
})
const Footer = dynamic(() => import("../../components/Footer"), {
    loading: () => <div className="py-4 text-center">Loading...</div>
})

export default async function Home() {
    const projects = await fetch_projects()

    return (
        <ClientComponents>
            <div className="min-h-screen text-white bg-transparent">
                <Header />
                <main className="container mx-auto px-4">
                    <Hero />
                    <About />
                    <TechStack />
                    <Projects projects={projects} />
                    <Contact />
                </main>
                <Footer />
            </div>
        </ClientComponents>
    )
}
