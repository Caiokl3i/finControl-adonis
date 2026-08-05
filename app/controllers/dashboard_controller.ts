import { filterDashboardValidator } from '#validators/dashboard'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
    async index({ auth, request }: HttpContext) {
        const user = auth.getUserOrFail()

        const filters = await request.validateUsing(filterDashboardValidator, {
            data: request.qs()
        })
    
        const month = filters.month ?? new Date().getMonth() + 1
        const year = filters.year ?? new Date().getFullYear()

        // BASE só monta o sql - await busca no banco
        const base = () => user
            .related('transactions')
            .query()
            .whereRaw("CAST(strftime('%m', date) AS INTEGER) = ?", [month])
            .whereRaw("CAST(strftime('%Y', date) AS INTEGER) = ?", [year])

        const incomeResult = await base()
            .where('type', 'income')
            .sum('amount as total')

        const expenseResult = await base()
            .where('type', 'expense')
            .sum('amount as total')

        const income = Number(incomeResult[0].$extras.total ?? 0)
        const expense = Number(expenseResult[0].$extras.total ?? 0)

        return {
            balance: income - expense,
            income,
            expense,
            month,
          }
    }
}