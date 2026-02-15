import axios from "axios"
import logger from "../utils/logger"
import { z } from "zod"
//
if (!process.env.GITHUB_USERNAME || !process.env.GITHUB_API_TOKEN) {
    throw new Error("GitHub username or API token not set")
}
//
const github_api_baseurl = `https://api.github.com`
//
interface Repository {
    name: string
    description: string
    url: string
    homepage_url: string
    readme: string
    images_url: string[]
    live_preview_url: string
}
//
const PinnedReposResponseSchema = z.object({
    data: z.object({
        user: z.object({
            pinnedItems: z.object({
                edges: z.array(
                    z
                        .object({
                            node: z.object({
                                name: z.string(),
                                description: z.string().nullable(),
                                url: z.string(),
                                homepageUrl: z.string().nullable()
                            })
                        })
                        .nullable()
                )
            })
        })
    })
})
//
async function get_pinned_repos(): Promise<Repository[]> {
    const query = `
        query($username: String!) {
            user(login: $username) {
                pinnedItems(first: 10, types: [REPOSITORY]) {
                    edges {
                        node {
                            ... on Repository {
                                name
                                description
                                url
                                homepageUrl
                            }
                        }
                    }
                }
            }
        }`
    //
    try {
        logger.info("Starting to fetch pinned repositories from GitHub")
        const response = await axios.post(
            `${github_api_baseurl}/graphql`,
            {
                query,
                variables: { username: process.env.GITHUB_USERNAME }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`
                }
            }
        )

        const validationResult = PinnedReposResponseSchema.safeParse(response.data)
        if (!validationResult.success) {
            logger.error("Invalid response structure from GitHub API", validationResult.error)
            return []
        }

        const repos = validationResult.data.data.user.pinnedItems.edges
            .filter(
                (edge): edge is { node: { name: string; description: string | null; url: string; homepageUrl: string | null } } =>
                    edge !== null
            )
            .map(edge => ({
                name: edge.node.name,
                description: edge.node.description || "-",
                url: edge.node.url,
                homepage_url: edge.node.homepageUrl || "",
                readme: "", // Placeholder for README content
                images_url: [] as string[],
                live_preview_url: ""
            }))

        logger.info("Successfully fetched pinned repositories from GitHub")
        return Promise.all(
            repos.map(async repo => {
                repo.readme = await get_repo_readme(repo)
                repo = replace_readme_image_urls(repo)
                return repo
            })
        )
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        logger.error(`Error fetching pinned repositories: ${errorMessage}`)
        return []
    }
}
//
function get_owner_and_repo(repo_url: string) {
    try {
        const parsed = new URL(repo_url)
        const parts = parsed.pathname.split("/").filter(Boolean)
        if (parts.length >= 2) {
            return { owner: parts[0], name: parts[1] }
        }
    } catch (error) {
        logger.warn(`Unable to parse repo URL: ${repo_url}`)
    }
    return null
}
//
async function get_repo_readme(repo: Repository) {
    const parsed = get_owner_and_repo(repo.url)
    const owner = parsed?.owner || process.env.GITHUB_USERNAME
    const name = parsed?.name || repo.name
    try {
        const response = await axios.get(
            `${github_api_baseurl}/repos/${owner}/${name}/readme`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
                    Accept: "application/vnd.github.v3.raw"
                }
            }
        )
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            logger.warn(`README not found for ${name} (404)`)
            return "README not found"
        }
        logger.error(`Error fetching README for ${name}:`, error)
        return "README not found"
    }
}
//
function replace_readme_image_urls(repo: Repository) {
    let all_image_urls: string[] = []
    const live_preview_url = extract_live_preview_url(repo.readme) || repo.homepage_url || ""

    // Replace Markdown image URLs
    repo.readme = repo.readme.replace(/(!\[.*?\]\()(.+?)(\))/g, (match, p1, p2, p3) => {
        let image_url = p2.startsWith("./") ? p2.replace("./", "/") : p2
        image_url = `${repo.url.replace("github.com", "raw.githubusercontent.com")}/refs/heads/main${image_url}`
        if (!all_image_urls.includes(image_url)) all_image_urls.push(image_url)
        return `${p1}${image_url}${p3}`
    })

    // Replace <img> tag src attributes
    repo.readme = repo.readme.replace(/<img\s+[^>]*src=["'](.+?)["'][^>]*>/g, (match, p1) => {
        let image_url = p1.startsWith("./") ? p1.replace("./", "/") : p1
        image_url = `${repo.url.replace("github.com", "raw.githubusercontent.com")}/refs/heads/main${image_url}`
        if (!all_image_urls.includes(image_url)) all_image_urls.push(image_url)
        return match.replace(p1, image_url)
    })

    // Replace Markdown links to .md files with HTML links that open in new tab
    repo.readme = repo.readme.replace(/\[([^\]]+)\]\((\.\/.+?\.md)\)/g, (match, linkText, relativePath) => {
        let link_url = relativePath.replace("./", "/")
        link_url = `${repo.url}/blob/main${link_url}`
        return `<a href="${link_url}" target="_blank">${linkText}</a>`
    })

    repo.images_url = all_image_urls
    repo.live_preview_url = live_preview_url
    return repo
}

function extract_live_preview_url(readme: string) {
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/gi
    const liveKeywordRegex = /\b(live\s*demo|demo|preview|website|app|site)\b/i

    let match: RegExpExecArray | null
    while ((match = linkRegex.exec(readme)) !== null) {
        const linkText = match[1]
        const url = match[2]

        if (liveKeywordRegex.test(linkText) && is_valid_live_preview_url(url)) {
            return url
        }
    }

    const inlineDemoRegex = /(?:^|\n)[^\n]*(?:live\s*demo|demo|preview)[^\n]*?(https?:\/\/[^\s)\]]+)/gi
    while ((match = inlineDemoRegex.exec(readme)) !== null) {
        const url = match[1]
        if (is_valid_live_preview_url(url)) {
            return url
        }
    }

    return ""
}

function is_valid_live_preview_url(url: string) {
    try {
        const parsed = new URL(url)
        const blockedHosts = new Set(["github.com", "www.github.com", "raw.githubusercontent.com", "gist.github.com"])
        return (parsed.protocol === "http:" || parsed.protocol === "https:") && !blockedHosts.has(parsed.hostname)
    } catch {
        return false
    }
}
//
let repositories: Repository[] = []
async function update_repos() {
    const pinned_repos = await get_pinned_repos()
    //
    if (pinned_repos.length == 0) {
        logger.warn("No pinned repositories found or API error occurred. Keeping previous data if available.")
        if (repositories.length > 0) return // Keep old data if new fetch failed
        // Don't throw logic - allow starting with empty array to prevent crash
        return
    }
    //
    repositories = pinned_repos
}
update_repos()
setInterval(() => {
    update_repos()
}, 1000 * 60 * 60)
//
export const get_repositories = () => {
    return repositories
}
