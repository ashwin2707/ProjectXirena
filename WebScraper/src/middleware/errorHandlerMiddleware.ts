import { NextFunction, Request, Response } from 'express'
import { DatabaseManagementError } from '../customErrors/databaseManagementError.js'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack)
	if (err instanceof DatabaseManagementError) {
		res.status(500).json({ error: err.message, details: err.originalError.message })
	} else {
		res.status(500).json({ error: 'An unexpected error occurred' })
	}
}
