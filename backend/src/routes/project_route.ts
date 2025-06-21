import { Request, Response, NextFunction } from "express"
import { get_repositories } from "../services/github_service"
import logger from "../utils/logger"
//
export const get_projects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logger.info("Fetching projects from GitHub")
    try {
        const repositories = await get_repositories()
        logger.info(`Fetched ${repositories.length} projects successfully`)
        res.status(200).json({ repositories })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        logger.error(`Error fetching projects from GitHub: ${errorMessage}`)
        res.status(500).json({ error: "Failed to fetch projects" })
    }
}
