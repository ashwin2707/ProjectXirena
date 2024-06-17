export class WebScrapingError extends Error {
	public status: number
	public originalError: any

	constructor(message: string, originalError: any = null, status: number = 500) {
		super(message)
		this.name = 'WebScrapingError'
		this.status = status
		this.originalError = originalError
		Error.captureStackTrace(this, this.constructor)
	}
}
