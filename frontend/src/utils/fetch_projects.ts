import { Project } from "../types/projects"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export async function fetch_projects(): Promise<Project[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
            next: { revalidate: 600 }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        let data = await response.json()

        const loading_project: Project = {
            name: "Loading ...",
            description: "-",
            url: "-",
            readme: "-",
            images_url: []
        }

        if (!data || !data.repositories) return [loading_project]
        data = data.repositories

        const projects = data as Project[]

        return projects
    } catch (error) {
        console.error("Error fetching data:", error)
        return []
    }
}
