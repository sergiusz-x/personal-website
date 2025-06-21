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
                    z.object({
                        node: z.object({
                            name: z.string(),
                            description: z.string().nullable(),
                            url: z.string()
                        })
                    })
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

        const repos = validationResult.data.data.user.pinnedItems.edges.map(edge => ({
            name: edge.node.name,
            description: edge.node.description || "-",
            url: edge.node.url,
            readme: "", // Placeholder for README content
            images_url: [] as string[],
            live_preview_url: ""
        }))

        logger.info("Successfully fetched pinned repositories from GitHub")
        return Promise.all(
            repos.map(async repo => {
                repo.readme = await get_repo_readme(repo.name)
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
async function get_repo_readme(name: string) {
    try {
        const response = await axios.get(`${github_api_baseurl}/repos/${process.env.GITHUB_USERNAME}/${name}/readme`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
                Accept: "application/vnd.github.v3.raw"
            }
        })
        return response.data
    } catch (error) {
        logger.error(`Error fetching README for ${name}:`, error)
        return "README not found"
    }
}
//
function replace_readme_image_urls(repo: Repository) {
    let all_image_urls: string[] = []
    let live_preview_url = "" // Search for preview links - multiple patterns to catch different formats
    const previewPatterns = [
        // Pattern 1: [text](https://preview.sergiusz.dev/...)
        /\[([^\]]*)\]\((https?:\/\/preview\.sergiusz\.dev\/[^)]+)\)/gi,
        // Pattern 2: [preview.sergiusz.dev/...](https://preview.sergiusz.dev/...)
        /\[preview\.sergiusz\.dev\/[^\]]+\]\((https?:\/\/preview\.sergiusz\.dev\/[^)]+)\)/gi,
        // Pattern 3: Any link containing preview.sergiusz.dev
        /\[[^\]]*\]\((https?:\/\/preview\.sergiusz\.dev\/[^)]+)\)/gi
    ]

    let previewMatch = null
    for (const pattern of previewPatterns) {
        previewMatch = repo.readme.match(pattern)
        if (previewMatch && previewMatch.length > 0) {
            break
        }
    }

    if (previewMatch && previewMatch.length > 0) {
        // Extract the URL from the first match using more flexible regex
        const urlMatch = previewMatch[0].match(/\((https?:\/\/preview\.sergiusz\.dev\/[^)]+)\)/)
        if (urlMatch) {
            live_preview_url = urlMatch[1]
        }
    }

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
//
let repositories: Repository[] = []
async function update_repos() {
    const pinned_repos = await get_pinned_repos()
    //
    if (pinned_repos.length == 0) {
        throw new Error("No repositories found")
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
