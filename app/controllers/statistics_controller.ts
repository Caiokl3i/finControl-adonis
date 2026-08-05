import { StatisticValidator } from '#validators/statistic'
import type { HttpContext } from '@adonisjs/core/http'

export default class StatisticsController {

  async index({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()

    const filters = await request.validateUsing(StatisticValidator, {
      data: request.qs()
    })

    const month = filters.month ?? new Date().getMonth() + 1
    const year = filters.year ?? new Date().getFullYear()

    const base = () => user
      .related('transactions')
      .query()
      .whereRaw("CAST(strftime('%m', date) AS INTEGER) = ?", [month])
      .whereRaw("CAST(strftime('%Y', date) AS INTEGER) = ?", [year])

    const largestExpense = await base()
      .where('type', 'expense')
      .orderBy('amount', 'desc')
      .first()
    
    const largestIncome = await base()
      .where('type', 'income')
      .orderBy('amount', 'desc')
      .first()

    const transactionCount = Number((await base()
      .count('* as total'))[0].$extras.total ?? 0)

    return {
      largestExpense: {
        description: largestExpense?.description ?? null,
        amount: largestExpense?.amount ?? null
      },
      largestIncome: {
        description: largestIncome?.description ?? null,
        amount: largestIncome?.amount ?? null
      },
      transactions: transactionCount,
      month: month
    }
  }
}