import { api } from './client'
import type { Dashboard, Statistics } from './types'

export async function getDashboard(filters: { month?: number; year?: number } = {}) {
  return api<Dashboard>('/dashboard', { query: filters })
}

export async function getStatistics(filters: { month?: number; year?: number } = {}) {
  return api<Statistics>('/statistics', { query: filters })
}
