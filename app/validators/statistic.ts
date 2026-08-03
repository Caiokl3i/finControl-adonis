import vine from '@vinejs/vine'


export const StatisticValidator = vine.create({
    month: vine.number().withoutDecimals().min(1).max(12).optional(),
    year: vine.number().withoutDecimals().min(2000).max(2100).optional()
})