import { NextFunction, Request, Response } from 'express'
import { DatabaseManagementError } from '../customErrors/databaseManagementError.js'
import { Perk } from '../dbs/dbd/perk/perk.js'
import { IPerk } from '../dbs/dbd/perk/perkInterface.js'
import { PerkType } from '../dbs/dbd/perk/perkType.js'
import { PerkDto } from '../dtos/perkDto.js'

export const getAllPerk = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const perks = await Perk.find().lean<IPerk>().exec()
		return res.status(200).json(perks)
	} catch (error) {
		next(new DatabaseManagementError('Error in getAllPerks', error))
	}
}

export const getSurvivorPerks = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const perks = await Perk.find({ type: PerkType.Survivor }).lean<IPerk>().exec()
		return res.status(200).json(perks)
	} catch (error) {
		next(new DatabaseManagementError('Error in getSurvivorPerks', error))
	}
}

export const getKillerPerks = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const perks = await Perk.find({ type: PerkType.Killer }).lean<IPerk>().exec()
		return res.status(200).json(perks)
	} catch (error) {
		next(new DatabaseManagementError('Error in getKillerPerks', error))
	}
}

export const insertPerk = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let upsertRequests: Promise<IPerk | null>[] = []

		if (Array.isArray(req.body)) {
			upsertRequests = req.body.map((perk: PerkDto) => {
				const filter = { name: perk.name }
				const update = perk
				const options = { new: true, upsert: true }
				return Perk.findOneAndUpdate(filter, update, options).lean<IPerk>().exec()
			})
		} else {
			const perkData: PerkDto = req.body
			const filter = { name: perkData.name }
			const update = perkData
			const options = { new: true, upsert: true }
			upsertRequests.push(Perk.findOneAndUpdate(filter, update, options).lean<IPerk>().exec())
		}
		const results = await Promise.all(upsertRequests)
		console.log('Upserting DBD perks successful')
		return res.status(200).json({ message: 'Upsert successful', data: results })
	} catch (error) {
		console.error('Upserting DBD perks failed')
		return next(new DatabaseManagementError('Error in upsertPerk', error))
	}
}

export const deleteAllPerks = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Perk.deleteMany({})
		return res.status(200).json({ message: 'All perks deleted successfully' })
	} catch (error) {
		next(new DatabaseManagementError('Error in deleteAllPerks', error))
	}
}
