export interface Project {
    name: string
    description: string
    url: string
    readme: string
    images_url: string[]
    live_preview_url?: string
}

export interface ProjectListProps {
    projects: Project[]
}
