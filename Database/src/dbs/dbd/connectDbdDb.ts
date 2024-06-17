import mongoose, { Connection } from 'mongoose'
import { ConfigError } from '../../customErrors/configError.js'
import { ConnectionError } from '../../customErrors/connectionError.js'
let connection: Connection | null = null

export const connectDbdDb = async (): Promise<Connection> => {
	if (!connection) {
		try {
			if (!process.env.MONGO_DBD_URI) {
				throw new ConfigError(
					`Configuration error: Variable ${'MONGO_DBD_URI'} not set`,
					'MONGO_DBD_URI',
					process.env.MONGO_DBD_URI
				)
			}
			connection = await mongoose.createConnection(process.env.MONGO_DBD_URI).asPromise()
			console.log('Successfully connected to Dead By Daylight Database.')
		} catch (error) {
			throw new ConnectionError('Failed to connect to Dead by Daylight Database', error)
		}
	}
	return connection
}

export const disconnectDbdDb = async (): Promise<void> => {
	if (connection) {
		await connection.close()
		connection = null
		console.log('Dead by Daylight Database Closed')
	}
}
