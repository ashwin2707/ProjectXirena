import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { PerkType } from '../dbs/dbd/perk/perkType.js'

export class PerkDto {
	@IsString()
	@IsNotEmpty()
	name!: string

	@IsString()
	@IsNotEmpty()
	description!: string

	@IsEnum(PerkType)
	@IsNotEmpty()
	type!: PerkType

	@IsString()
	@IsNotEmpty()
	character!: string
}
