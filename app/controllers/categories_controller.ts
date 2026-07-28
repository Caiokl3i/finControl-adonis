import CategoryTransformer from '#transformers/category_transformer'
import { createCategoryValidator, updateCategoryValidator } from '#validators/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async index({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const categories = await user.related('categories').query().orderBy('id', 'desc')

    return serialize(CategoryTransformer.transform(categories))
  }
  
  async store({ auth, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createCategoryValidator)
    
    const category = await user.related('categories').create(payload)

    return serialize(CategoryTransformer.transform(category))
  }

  /**
   * Show individual record
   */
  async show({ auth, params, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const category = await user.related('categories').query().where('id', params.id).firstOrFail()

    return serialize(CategoryTransformer.transform(category))
  }
    
  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateCategoryValidator)

    const category = await user.related('categories').query().where('id', params.id).firstOrFail()

    category.merge(payload)
    await category.save()

    return serialize(CategoryTransformer.transform(category))
    
  }
    
  /**
   * Delete record
   */
  async destroy({ auth, params, }: HttpContext) {
    const user = auth.getUserOrFail()

    const category = await user.related('categories').query().where('id', params.id).firstOrFail()

    await category.delete()

    return { 'message': 'Category deleted successfully' }
  }
}