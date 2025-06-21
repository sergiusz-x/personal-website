"use client"

import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa"
import { trackEvent } from "../utils/tracking"

const links = [
    { href: "https://github.com/sergiusz-x/", label: "GitHub", icon: <FaGithub /> },
    { href: "https://leetcode.com/u/sergiusz_x/", label: "LeetCode", icon: <FaCode /> },
    { href: "https://www.linkedin.com/in/sergiusz-sanetra/", label: "LinkedIn", icon: <FaLinkedin /> }
]

export default function Footer() {
    return (
        <footer id="socials" className="bg-blue text-white py-2 mt-12">
            <div className="container mx-auto flex justify-center space-x-6">
                {links.map(link => (
                    <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                        onClick={() =>
                            trackEvent("outbound_link_click", {
                                url: link.href,
                                text: link.label,
                                location: "footer"
                            })
                        }
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </a>
                ))}
            </div>
        </footer>
    )
}
