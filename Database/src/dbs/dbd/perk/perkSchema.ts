import { Schema } from 'mongoose'
import { IPerk } from './perkInterface.js'
import { PerkType } from './perkType.js'

export const PerkSchema: Schema<IPerk> = new Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	type: { type: String, enum: Object.values(PerkType), required: true },
	character: { type: String, required: true },
})
PerkSchema.index({ name: 1 }, { unique: true })
