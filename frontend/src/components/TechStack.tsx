"use client"

import React from "react"
import { FaReact, FaNodeJs, FaFileCode, FaTerminal } from "react-icons/fa"
import { TbCube3dSphere } from "react-icons/tb"
import { useTranslation } from "next-i18next"
import {
    SiDiscord,
    SiExpress,
    SiFigma,
    SiGit,
    SiJavascript,
    SiLinux,
    SiMongodb,
    SiMysql,
    SiNextdotjs,
    SiPhp,
    SiPython,
    SiTailwindcss,
    SiTypescript,
    SiUipath
} from "react-icons/si"

const techStack = [
    // Programming Languages
    { name: "JS", icon: <SiJavascript size={48} /> },
    { name: "TS", icon: <SiTypescript size={48} /> },
    { name: "Python", icon: <SiPython size={48} /> },
    { name: "PHP", icon: <SiPhp size={48} /> },
    { name: "VBA", icon: <FaFileCode size={48} /> },
    { name: "Bash", icon: <FaTerminal size={48} /> },

    // Frameworks & Libraries
    { name: "Node.js", icon: <FaNodeJs size={48} /> },
    { name: "Express.js", icon: <SiExpress size={48} /> },
    { name: "React.js", icon: <FaReact size={48} /> },
    { name: "Next.js", icon: <SiNextdotjs size={48} /> },
    { name: "discord.js", icon: <SiDiscord size={48} /> },

    // Styles
    { name: "Tailwind", icon: <SiTailwindcss size={48} /> },

    // Databases
    { name: "SQL", icon: <SiMysql size={48} /> },
    { name: "MongoDB", icon: <SiMongodb size={48} /> },

    // Tools & Utilities
    { name: "Git", icon: <SiGit size={48} /> },
    { name: "Linux", icon: <SiLinux size={48} /> },
    
    // Design & Automation
    { name: "Figma", icon: <SiFigma size={48} /> },
    { name: "UiPath", icon: <SiUipath size={48} /> },
    { name: "Fusion360", icon: <TbCube3dSphere size={48} /> }
]

export default function TechStack() {
    const { t } = useTranslation()

    return (
        <section id="techstack" className="py-16">
            <h2 className="text-3xl font-bold mb-2 text-center text-blue mb-8">{t("techStack.title")}</h2>
            <div className="flex flex-wrap justify-center gap-6">
                {techStack.map((tech, index) => (
                    <div
                        key={`${tech.name}-${index}`}
                        className="bg-black p-6 rounded-3xl shadow-convex hover:shadow-concave active:shadow-concave_clicked transition-all duration-100 text-white flex flex-col items-center justify-center w-28 h-28 focus:outline-none"
                    >
                        <div className="text-4xl mb-2">{tech.icon}</div>
                        <span className="text-sm font-semibold uppercase">{tech.name}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}
