import { connectDbdDb } from '../connectDbdDb.js'
import { IPerk } from './perkInterface.js'
import { PerkSchema } from './perkSchema.js'

export const Perk = (await connectDbdDb()).model<IPerk>('Perk', PerkSchema)
