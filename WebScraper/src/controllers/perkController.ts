import { NextFunction, Request, Response } from 'express'
import { ScrapingStatus } from '../enums/scrapingStatus'
import { dbdPerkScraper } from '../scrapers/dbdPerkScraper'

export const scrapeAllPerks = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (dbdPerkScraper.getStatus() === ScrapingStatus.Idle) {
			dbdPerkScraper.scrapePerks()
			return res.status(200).json({ message: 'Starting perk scraping job' })
		} else if (dbdPerkScraper.getStatus() === ScrapingStatus.Initializing) {
			return res.status(202).json({ message: 'Perk scraping job initializing client' })
		} else if (dbdPerkScraper.getStatus() === ScrapingStatus.Scraping) {
			return res.status(202).json({ message: 'Perk scraping job scraping data' })
		} else if (dbdPerkScraper.getStatus() === ScrapingStatus.Parsing) {
			return res.status(202).json({ message: 'Perk scraping job parsing data' })
		} else if (dbdPerkScraper.getStatus() === ScrapingStatus.StoringData) {
			return res.status(202).json({ message: 'Perk scraping job storing data' })
		}
	} catch (error) {
		next(error)
	}
}
