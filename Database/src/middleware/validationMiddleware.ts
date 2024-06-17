import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { NextFunction, Request, Response } from 'express'

const formatErrors = (errors: ValidationError[]) => {
	return errors.map((err) => ({
		property: err.property,
		constraints: err.constraints,
	}))
}
const validateInstance = async (dtoClass: any, data: any) => {
	const dtoInstance = plainToInstance(dtoClass, data)
	const errors = await validate(dtoInstance)
	return { dtoInstance, errors }
}

export const validationMiddleware = (dtoClass: any) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const body = req.body
		let allErrors: ValidationError[] = []
		let validatedInstances: any

		if (Array.isArray(body)) {
			const validationResults = await Promise.all(body.map((item) => validateInstance(dtoClass, item)))
			validatedInstances = validationResults.map((result) => result.dtoInstance)
			allErrors = validationResults.flatMap((result) => result.errors)
		} else {
			const { dtoInstance, errors } = await validateInstance(dtoClass, body)
			validatedInstances = dtoInstance
			allErrors = errors
		}

		if (allErrors.length > 0) {
			const formattedErrors = formatErrors(allErrors)
			return res.status(400).json({ errors: formattedErrors })
		} else {
			req.body = validatedInstances
			next()
		}
	}
}
