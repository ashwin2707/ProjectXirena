import express from 'express'
import { errorHandler } from './middleware/errorHandlerMiddleware'
import perkRouter from './routes/perkRoutes.js'

const port = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use('/api/scrape/dbdPerks', perkRouter)
app.use(errorHandler)

const server = app.listen(port, () => {
	console.log(`WebScraper Server listening on port ${port}`)
})

const gracefulShutdown = () => {
	console.log('Received kill signal, shutting down gracefully.')
	server.close(async () => {
		process.exit(0)
	})

	setTimeout(() => {
		console.error('Could not close connection in time, forcefully shutting down')
		process.exit(1)
	}, 25000)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
