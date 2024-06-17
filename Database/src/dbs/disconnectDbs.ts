import { disconnectDbdDb } from './dbd/connectDbdDb.js'

export const disconnectDbs = async (): Promise<void> => {
	await Promise.all([disconnectDbdDb()])
}
