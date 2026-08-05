import { api } from './client'
import type { Transaction, TransactionFilters } from './types'

export async function listTransactions(filters: TransactionFilters = {}) {
  return api<Transaction[]>('/transactions', { query: filters })
}

export async function createTransaction(input: {
  categoryId: number
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  observation?: string | null
}) {
  return api<Transaction>('/transactions', { method: 'POST', body: input })
}

export async function updateTransaction(
  id: number,
  input: Partial<{
    categoryId: number
    description: string
    amount: number
    type: 'income' | 'expense'
    date: string
    observation: string | null
  }>,
) {
  return api<Transaction>(`/transactions/${id}`, { method: 'PUT', body: input })
}

export async function deleteTransaction(id: number) {
  return api<{ message: string }>(`/transactions/${id}`, { method: 'DELETE' })
}
