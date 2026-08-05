/** Tipos espelhando transformers / respostas do Adonis. */

export type User = {
  id: number
  name: string | null
  email: string
  createdAt?: string
  updatedAt?: string | null
  initials?: string
}

export type Category = {
  id: number
  name: string
  color: string
  icon: string
  createdAt?: string
  updatedAt?: string | null
}

export type Transaction = {
  id: number
  categoryId: number
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  observation: string | null
  createdAt?: string
  updatedAt?: string | null
}

export type Dashboard = {
  balance: number
  income: number
  expense: number
  month: number
}

export type Statistics = {
  largestExpense: { description: string | null; amount: number | null }
  largestIncome: { description: string | null; amount: number | null }
  transactions: number
  month: number
}

export type AuthResponse = {
  user: User
  token: string
}

export type ApiErrorBody = {
  message?: string
  errors?: Array<{ message: string; field?: string; rule?: string }>
}

export type TransactionFilters = {
  month?: number
  year?: number
  type?: 'income' | 'expense'
  category?: number
}
