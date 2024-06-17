export class ConfigError extends Error {
	public key: string
	public value: any

	constructor(message: string, key: string, value: any = null) {
		super(message)
		this.name = 'ConfigError'
		this.key = key
		this.value = value
		Error.captureStackTrace(this, this.constructor)
	}
}
