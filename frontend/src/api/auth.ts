import { api, setToken } from './client'
import type { AuthResponse, User } from './types'

export async function signup(input: {
  name: string | null
  email: string
  password: string
  passwordConfirmation: string
}) {
  const data = await api<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: input,
    auth: false,
  })
  setToken(data.token)
  return data
}

export async function login(input: { email: string; password: string }) {
  const data = await api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: input,
    auth: false,
  })
  setToken(data.token)
  return data
}

export async function logout() {
  try {
    await api<{ message: string }>('/account/logout', { method: 'POST' })
  } finally {
    setToken(null)
  }
}

export async function getProfile() {
  return api<User>('/account/profile')
}
