import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new dashboard.
 */
export const filterDashboardValidator = vine.create({
    month: vine.number().withoutDecimals().min(1).max(12).optional(),
    year: vine.number().withoutDecimals().min(2000).max(2100).optional()
})

/**
 * Validator to validate the payload when updating
 * an existing dashboard.
 */