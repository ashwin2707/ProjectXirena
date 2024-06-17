import { Router } from 'express'
import {
	deleteAllPerks,
	getAllPerk,
	getKillerPerks,
	getSurvivorPerks,
	insertPerk,
} from '../controllers/perkController.js'
import { PerkDto } from '../dtos/perkDto.js'
import { validationMiddleware } from '../middleware/validationMiddleware.js'

const router = Router()

// Get
router.get('/', getAllPerk)
router.get('/survivor', getSurvivorPerks)
router.get('/killer', getKillerPerks)

// Put
router.put('/', validationMiddleware(PerkDto), insertPerk)

// Delete
router.delete('/', deleteAllPerks)
export default router
