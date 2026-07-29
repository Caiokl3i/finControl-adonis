import TransactionTransformer from '#transformers/transaction_transformer'
import { createTransactionValidator } from '#validators/transaction'
import type { HttpContext } from '@adonisjs/core/http'

export default class TransactionsController {
  /**
   * Display a list of resource
   */
  async index({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const transactions = await user.related('transactions').query().orderBy('id', 'desc')

    return serialize(TransactionTransformer.transform(transactions))
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createTransactionValidator)

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
  async update({ auth, params, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createTransactionValidator)

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