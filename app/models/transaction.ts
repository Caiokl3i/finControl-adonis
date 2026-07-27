import { TransactionSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Category from './category.ts'

export default class Transaction extends TransactionSchema {

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @belongsTo(() => Category)
    declare category: BelongsTo<typeof Category>
}