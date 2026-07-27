import { CategorySchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.ts'

export default class Category extends CategorySchema {

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @hasMany(() => Transaction)
    declare transactions: HasMany<typeof Transaction>
}