export class DatabaseManagementError extends Error {
	public status: number
	public originalError: any

	constructor(message: string, originalError: any = null, status: number = 500) {
		super(message)
		this.name = 'UpsertError'
		this.status = status
		this.originalError = originalError
		Error.captureStackTrace(this, this.constructor)
	}
}
