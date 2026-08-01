import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new transaction.
 */
export const createTransactionValidator = vine.create({
    categoryId: vine.number().withoutDecimals().positive(),
    description: vine.string().trim().minLength(1).maxLength(255),
    amount: vine.number().positive().decimal([0, 2]),
    type: vine.enum(['income', 'expense']),
    date: vine.date(),
    observation: vine.string().trim().maxLength(255).nullable().optional()
})

/**
 * Validator to validate the payload when updating
 * an existing transaction.
 */
export const updateTransactionValidator = vine.create({
    category_id: vine.number().withoutDecimals().positive().optional(),
    description: vine.string().trim().minLength(1).maxLength(255).optional(),
    amount: vine.number().positive().decimal([0, 2]).optional(),
    type: vine.enum(['income', 'expense']).optional(),
    date: vine.date().optional(),
    observation: vine.string().trim().maxLength(255).nullable().optional()
})

export const filterTransactionValidator = vine.create({
    month: vine.number().withoutDecimals().min(1).max(12).optional(),
    year: vine.number().withoutDecimals().min(2000).max(2100).optional(),
    type: vine.enum(['income', 'expense']).optional(),
    category: vine.number().withoutDecimals().positive().optional()
})