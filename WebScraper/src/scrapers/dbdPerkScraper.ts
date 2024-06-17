import axios from 'axios'
import { JSDOM } from 'jsdom'
import puppeteer, { Browser, Page } from 'puppeteer'
import { ConfigError } from '../customErrors/configError'
import { WebScrapingError } from '../customErrors/webScrapingError'
import { PerkType } from '../enums/perkType'
import { ScrapingStatus } from '../enums/scrapingStatus'
import { Perk } from '../interfaces/perk'

class DbdPerkScraper {
	private status: ScrapingStatus
	constructor() {
		this.status = ScrapingStatus.Idle
	}

	private async init(): Promise<{ browser: Browser; page: Page }> {
		this.status = ScrapingStatus.Initializing
		console.log('DBD Perk Scraper Initializing')

		const browser = await puppeteer.launch({
			executablePath: '/usr/bin/chromium',
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		})
		const page = await browser.newPage()
		await page.goto('https://deadbydaylight.fandom.com/wiki/Perks')
		return { browser: browser, page: page }
	}

	private async scrape(browser: Browser, page: Page): Promise<{ survivorTable: string; killerTable: string }> {
		this.status = ScrapingStatus.Scraping
		console.log('DBD Perk Scraper Scraping')

		const {
			survivorPerkData,
			killerPerkData,
		}: { survivorPerkData: string | undefined; killerPerkData: string | undefined } = await page.evaluate(() => {
			const survivorTable = document.querySelector('table.wikitable.sortable[data-index-number="0"]')
			const killerTable = document.querySelector('table.wikitable.sortable[data-index-number="1"]')
			return { survivorPerkData: survivorTable?.outerHTML, killerPerkData: killerTable?.outerHTML }
		})
		if (!survivorPerkData) {
			throw new Error()
		} else if (!killerPerkData) {
			throw new Error()
		}
		await browser.close()

		return { survivorTable: survivorPerkData, killerTable: killerPerkData }
	}

	private parse(table: string, perkType: PerkType): Perk[] {
		this.status = ScrapingStatus.Parsing
		console.log(`DBD Perk Scraper Parsing ${perkType}`)

		const dom = new JSDOM(table)
		const { document } = dom.window

		return Array.from(document.querySelectorAll('tbody > tr')).map((row) => {
			const name = row.children[1].querySelector('a')?.getAttribute('title')?.trim()
			const description = row.children[2].textContent?.trim()
			let character = row.children[3].querySelector('a')?.getAttribute('title')?.trim()
			if (!character || character === '') {
				character = 'General'
			}
			if (!name || name === '') {
				throw new WebScrapingError('Name not found')
			} else if (!description || description === '') {
				throw new WebScrapingError('Description not found')
			} else if (!character || character === '') {
				throw new WebScrapingError('Character name not found')
			}
			return {
				name: name,
				description: description,
				type: perkType,
				character: character,
			}
		})
	}

	private async upsertData(perks: Perk[]): Promise<void> {
		this.status = ScrapingStatus.StoringData
		console.log('DBD Perk Scraper Storing')

		if (!process.env.DB_URL) {
			throw new ConfigError(`Configuration error: Variable ${'DB_URL'} not set`, 'DB_URL', process.env.DB_URL)
		}

		try {
			await axios.put(process.env.DB_URL, perks)
			console.log('Data sent successfully')
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error('Axios error:', error.response?.data || error.message)
			} else {
				console.error('Unexpected	error', error)
			}
		}
	}

	async scrapePerks(): Promise<void> {
		const { browser, page }: { browser: Browser; page: Page } = await this.init()
		const { survivorTable, killerTable }: { survivorTable: string; killerTable: string } = await this.scrape(
			browser,
			page
		)
		const perks = [this.parse(survivorTable, PerkType.Survivor), this.parse(killerTable, PerkType.Killer)].flat()
		await this.upsertData(perks)

		this.status = ScrapingStatus.Idle
		console.log('DBD Perk Scraper Idle')
	}

	getStatus(): ScrapingStatus {
		return this.status
	}
}

export const dbdPerkScraper = new DbdPerkScraper()
