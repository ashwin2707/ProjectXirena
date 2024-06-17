import { PerkType } from '../enums/perkType.js'

export interface Perk {
	name: string
	description: string
	type: PerkType
	character: string
}
