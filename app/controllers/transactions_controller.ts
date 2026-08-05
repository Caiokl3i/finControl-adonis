import TransactionTransformer from '#transformers/transaction_transformer'
import { createTransactionValidator, filterTransactionValidator, updateTransactionValidator } from '#validators/transaction'
import type { HttpContext } from '@adonisjs/core/http'

export default class TransactionsController {
  /**
   * Display a list of resource
   */
  async index({ auth, serialize, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const filters = await request.validateUsing(filterTransactionValidator, {
      data: request.qs()
    })

    const transactions = await user
      .related('transactions')
      .query()
      .if(filters.type, (query) => {
        query.where('type', filters.type!)
      })
      .if(filters.category, (query) => {
        query.where('category_id', filters.category!)
      })
      .if(filters.month, (query) => {
        query.whereRaw("CAST(strftime('%m', date) AS INTEGER) = ?", [filters.month!])
      })
      .if(filters.year, (query) => {
        query.whereRaw("CAST(strftime('%Y', date) AS INTEGER) = ?", [filters.year!])
      })
      .orderBy('date', 'desc')

    return serialize(TransactionTransformer.transform(transactions))
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createTransactionValidator)

    
    const category = await user
      .related('categories')
      .query()
      .where('id', payload.categoryId)
      .first()
    
    if(!category) {
      return response.notFound({
        message: 'Category not found'
      })
    }

    const transaction = await user.related('transactions').create(payload)

    return serialize(TransactionTransformer.transform(transaction))
  }

  /**
   * Show individual record
   */
  async show({ auth, params, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const transaction = await user.related('transactions').query().where('id', params.id).firstOrFail()

    return serialize(TransactionTransformer.transform(transaction))
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateTransactionValidator)

    if(payload.categoryId) {
      const category = await user
        .related('categories')
        .query()
        .where('id', payload.categoryId!)
        .first()
      
      if(!category) {
        return response.notFound({
          message: 'Category not found'
        })
      }
    }
    const transaction = await user.related('transactions').query().where('id', params.id).firstOrFail() 

    transaction.merge(payload)
    await transaction.save()

    return serialize(TransactionTransformer.transform(transaction))
  }
  
  /**
   * Delete record
   */
  async destroy({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()

    const transaction = await user.related('transactions').query().where('id', params.id).firstOrFail() 

    await transaction.delete()

    return { 'message': 'Transaction deleted successfully' }
  }
}