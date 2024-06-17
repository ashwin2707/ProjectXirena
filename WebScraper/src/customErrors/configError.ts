export class ConfigError extends Error {
	public key: string
	public originalValue: any

	constructor(message: string, key: string, originalValue: any = null) {
		super(message)
		this.name = 'ConfigError'
		this.key = key
		this.originalValue = originalValue
		Error.captureStackTrace(this, this.constructor)
	}
}
