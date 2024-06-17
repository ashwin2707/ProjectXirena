import { PerkType } from './perkType.js'

export interface IPerk extends Document {
	name: string
	description: string
	type: PerkType
	character: string
}
