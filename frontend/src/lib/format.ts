export function formatMoney(value: number | string | null | undefined) {
  const n = Number(value ?? 0)
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function todayISO() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function formatDateLabel(iso: string) {
  const raw = iso.slice(0, 10)
  const [y, m, d] = raw.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

export const ICON_OPTIONS = [
  'wallet',
  'home',
  'food',
  'car',
  'work',
  'health',
  'fun',
  'edu',
] as const

export const COLOR_OPTIONS = [
  '#E8B86D',
  '#6FBF8B',
  '#E88B6D',
  '#6DA8E8',
  '#C78BE8',
  '#E8D46D',
  '#8BE0D0',
  '#E86D8B',
]
