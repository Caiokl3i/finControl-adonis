import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new category.
 */
export const createCategoryValidator = vine.create({
    name: vine.string().trim().maxLength(100).minLength(1),
    color: vine.string().trim().fixedLength(7),
    icon: vine.string().trim().maxLength(50)
})
    
/**
 * Validator to validate the payload when updating
 * an existing category.
 */
export const updateCategoryValidator = vine.create({
    name: vine.string().trim().maxLength(100).minLength(1).optional(),
    color: vine.string().trim().fixedLength(7).optional(),
    icon: vine.string().trim().maxLength(50).optional()
})