"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import MarkdownPreview from "@uiw/react-markdown-preview"
import { useTranslation } from "next-i18next"
import { TbDeviceDesktopSearch } from "react-icons/tb"
import { Project } from "../types/projects"
import { trackEvent } from "../utils/tracking"

export default function Projects({ projects }: { projects: Project[] }) {
    const { t } = useTranslation()
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    // Function to preload images with error handling and caching
    const preloadImages = (urls: string[]) => {
        urls.forEach(url => {
            const img = new Image()
            // Add cache control headers for Cloudflare
            img.crossOrigin = "anonymous"
            img.src = url
            img.onerror = () => console.error(`Failed to load image at ${url}`)
        })
    }

    useEffect(() => {
        if (projects && projects.length > 0) {
            // Wait for page to load completely, then add a small delay before preloading
            const preloadWithDelay = () => {
                setTimeout(() => {
                    // Gather all image URLs from projects' `images_url` arrays
                    const allImageUrls = projects.flatMap(project => project.images_url)
                    // Preload all gathered image URLs
                    preloadImages(allImageUrls)
                }, 2000) // 2 second delay after page load
            }

            // Check if page is already loaded
            if (document.readyState === "complete") {
                preloadWithDelay()
            } else {
                // Wait for page to load completely
                window.addEventListener("load", preloadWithDelay)
                return () => window.removeEventListener("load", preloadWithDelay)
            }
        }
    }, [projects])

    const openProject = (project: Project) => {
        trackEvent("project_readme_opened", { project_name: project.name })
        setSelectedProject(project)
    }

    return (
        <section id="projects" className="py-16">
            <h2 className="text-3xl font-bold mb-2 text-center text-blue">{t("projects.title")}</h2>
            <p className="text-center text-xs text-gray-500 mb-6 -mt-2">{t("projects.subtext")}</p>

            {!projects || projects.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">{t("projects.noProjectsMessage")}</p>
                    <a
                        href="https://github.com/sergiusz-x/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue hover:text-blue-400 transition-colors underline"
                        onClick={() =>
                            trackEvent("outbound_link_click", {
                                url: "https://github.com/sergiusz-x/",
                                text: "GitHub fallback link",
                                location: "projects_no_data"
                            })
                        }
                    >
                        https://github.com/sergiusz-x/
                    </a>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-8">
                    {projects?.map((project, index) => (
                        <Dialog key={index}>
                            <DialogTrigger asChild>
                                <div
                                    className="bg-black p-6 w-full max-w-xs rounded-3xl shadow-convex hover:shadow-concave active:shadow-concave_clicked transition-all duration-100 text-white cursor-pointer focus:outline-none outline-none relative"
                                    onClick={() => openProject(project)}
                                    tabIndex={0}
                                >
                                    <h3 className="text-xl font-bold mb-2 text-white">{project.name}</h3>
                                    <p className="text-gray-400">{project.description}</p>{" "}
                                    {project.live_preview_url && (
                                        <div
                                            className="absolute top-4 right-4 text-blue p-2"
                                            title={t("projects.livePreviewAvailable")}
                                        >
                                            <TbDeviceDesktopSearch size={16} />
                                        </div>
                                    )}
                                </div>
                            </DialogTrigger>
                            {selectedProject && selectedProject.name === project.name && (
                                <DialogContent className="bg-black p-6 rounded-3xl max-w-6xl max-h-[90vh] border border-blue flex flex-col">
                                    <DialogTitle className="text-white flex-shrink-0">
                                        {selectedProject.name}
                                    </DialogTitle>
                                    <DialogDescription asChild>
                                        <div className="text-gray-400 rounded-lg overflow-y-auto flex-1 p-6 bg-markdown_background">
                                            <MarkdownPreview source={selectedProject.readme} />
                                        </div>
                                    </DialogDescription>
                                    <div className="flex justify-end gap-4 mt-4 flex-shrink-0">
                                        {selectedProject.live_preview_url && (
                                            <a
                                                href={selectedProject.live_preview_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() =>
                                                    trackEvent("outbound_link_click", {
                                                        url: selectedProject.live_preview_url,
                                                        text: t("projects.livePreviewButton"),
                                                        project_name: selectedProject.name,
                                                        location: "project_modal"
                                                    })
                                                }
                                            >
                                                <Button variant="convexconcave" size="rounded_sm">
                                                    {t("projects.livePreviewButton")}
                                                </Button>
                                            </a>
                                        )}
                                        <a
                                            href={selectedProject.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() =>
                                                trackEvent("outbound_link_click", {
                                                    url: selectedProject.url,
                                                    text: t("projects.githubButton"),
                                                    project_name: selectedProject.name,
                                                    location: "project_modal"
                                                })
                                            }
                                        >
                                            <Button variant="convexconcave" size="rounded_sm">
                                                {t("projects.githubButton")}
                                            </Button>
                                        </a>
                                    </div>
                                </DialogContent>
                            )}
                        </Dialog>
                    ))}
                </div>
            )}
        </section>
    )
}
