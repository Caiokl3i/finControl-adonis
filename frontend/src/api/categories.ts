import { api } from './client'
import type { Category } from './types'

export async function listCategories() {
  return api<Category[]>('/categories')
}

export async function createCategory(input: { name: string; color: string; icon: string }) {
  return api<Category>('/categories', { method: 'POST', body: input })
}

export async function updateCategory(
  id: number,
  input: Partial<{ name: string; color: string; icon: string }>,
) {
  return api<Category>(`/categories/${id}`, { method: 'PUT', body: input })
}

export async function deleteCategory(id: number) {
  return api<{ message: string }>(`/categories/${id}`, { method: 'DELETE' })
}
