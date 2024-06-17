import express from 'express'
import 'reflect-metadata'
import { disconnectDbs } from './dbs/disconnectDbs.js'
import { errorHandler } from './middleware/errorHandlerMiddleware.js'
import perkRouter from './routes/perkRoutes.js'

const port = process.env.PORT || 3000
const app = express()
app.use(express.json({ limit: '100mb' }))
app.use('/api/perks', perkRouter)
app.use(errorHandler)

const server = app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

const gracefulShutdown = () => {
	console.log('Received kill signal, shutting down gracefully.')
	server.close(async () => {
		console.log('Closing remaining connections')
		try {
			await disconnectDbs()
			process.exit(0)
		} catch (error) {
			console.error('Error during database disconnection', error)
			process.exit(1)
		}
	})

	setTimeout(() => {
		console.error('Could not close connection in time, forcefully shutting down')
		process.exit(1)
	}, 25000)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
