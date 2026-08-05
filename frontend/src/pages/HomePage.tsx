import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { formatApiError } from '../api/client'
import * as categoriesApi from '../api/categories'
import * as transactionsApi from '../api/transactions'
import * as statsApi from '../api/stats'
import type { Category, Dashboard, Statistics, Transaction } from '../api/types'
import {
  COLOR_OPTIONS,
  ICON_OPTIONS,
  formatDateLabel,
  formatMoney,
  todayISO,
} from '../lib/format'

type Tab = 'overview' | 'transactions' | 'categories'

export function HomePage() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [error, setError] = useState<string | null>(null)

  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const [txType, setTxType] = useState<'income' | 'expense' | ''>('')
  const [txCategory, setTxCategory] = useState<number | ''>('')

  const categoryMap = useMemo(() => {
    const map = new Map<number, Category>()
    for (const c of categories) map.set(c.id, c)
    return map
  }, [categories])

  const refresh = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const [dash, stats, cats, txs] = await Promise.all([
        statsApi.getDashboard({ month, year }),
        statsApi.getStatistics({ month, year }),
        categoriesApi.listCategories(),
        transactionsApi.listTransactions({
          month,
          year,
          type: txType || undefined,
          category: txCategory === '' ? undefined : txCategory,
        }),
      ])
      setDashboard(dash)
      setStatistics(stats)
      setCategories(Array.isArray(cats) ? cats : [])
      setTransactions(Array.isArray(txs) ? txs : [])
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }, [month, year, txType, txCategory])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return (
    <div className="app-shell">
      <header className="topbar row-between">
        <div className="brand-mark">
          <span className="brand-wave" aria-hidden />
          <span className="brand">Fluxo</span>
        </div>
        <div className="row">
          <div className="user-chip">
            <span className="avatar">
              {user?.initials ?? user?.email?.slice(0, 2).toUpperCase()}
            </span>
            <span className="user-name">{user?.name || user?.email}</span>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => void logout()}>
            Sair
          </button>
        </div>
      </header>

      <div className="period-bar row-between fade-up">
        <div className="row period-fields">
          <div className="field field-inline">
            <label htmlFor="month">Mês</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          <div className="field field-inline">
            <label htmlFor="year">Ano</label>
            <input
              id="year"
              type="number"
              min={2000}
              max={2100}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
        </div>
        <nav className="nav-tabs" aria-label="Seções">
          {(
            [
              ['overview', 'Resumo'],
              ['transactions', 'Lançamentos'],
              ['categories', 'Categorias'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`nav-tab ${tab === id ? 'active' : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading && !dashboard ? (
        <p className="muted fade-up">Carregando…</p>
      ) : tab === 'overview' ? (
        <Overview
          dashboard={dashboard}
          statistics={statistics}
          month={month}
        />
      ) : tab === 'transactions' ? (
        <TransactionsPanel
          transactions={transactions}
          categories={categories}
          categoryMap={categoryMap}
          txType={txType}
          txCategory={txCategory}
          setTxType={setTxType}
          setTxCategory={setTxCategory}
          onChanged={() => void refresh()}
          onError={setError}
        />
      ) : (
        <CategoriesPanel
          categories={categories}
          onChanged={() => void refresh()}
          onError={setError}
        />
      )}
    </div>
  )
}

function Overview({
  dashboard,
  statistics,
  month,
}: {
  dashboard: Dashboard | null
  statistics: Statistics | null
  month: number
}) {
  if (!dashboard || !statistics) {
    return <div className="empty">Sem dados para este período.</div>
  }

  return (
    <div className="overview fade-up">
      <section className="balance-hero">
        <p className="eyebrow">Saldo · mês {String(month).padStart(2, '0')}</p>
        <p className={`balance-value ${dashboard.balance < 0 ? 'neg' : ''}`}>
          {formatMoney(dashboard.balance)}
        </p>
        <div className="metric-row">
          <div className="metric income">
            <span>Receitas</span>
            <strong>{formatMoney(dashboard.income)}</strong>
          </div>
          <div className="metric expense">
            <span>Despesas</span>
            <strong>{formatMoney(dashboard.expense)}</strong>
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">Lançamentos</span>
          <strong className="stat-value">{statistics.transactions}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Maior receita</span>
          <strong className="stat-value income-text">
            {formatMoney(statistics.largestIncome.amount)}
          </strong>
          <span className="stat-sub">{statistics.largestIncome.description ?? '—'}</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Maior despesa</span>
          <strong className="stat-value expense-text">
            {formatMoney(statistics.largestExpense.amount)}
          </strong>
          <span className="stat-sub">{statistics.largestExpense.description ?? '—'}</span>
        </article>
      </section>
    </div>
  )
}

function TransactionsPanel({
  transactions,
  categories,
  categoryMap,
  txType,
  txCategory,
  setTxType,
  setTxCategory,
  onChanged,
  onError,
}: {
  transactions: Transaction[]
  categories: Category[]
  categoryMap: Map<number, Category>
  txType: 'income' | 'expense' | ''
  txCategory: number | ''
  setTxType: (v: 'income' | 'expense' | '') => void
  setTxCategory: (v: number | '') => void
  onChanged: () => void
  onError: (msg: string | null) => void
}) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [date, setDate] = useState(todayISO())
  const [observation, setObservation] = useState('')
  const [creating, setCreating] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)

  useEffect(() => {
    if (categoryId === '' && categories[0]) {
      setCategoryId(categories[0].id)
    }
  }, [categories, categoryId])

  async function onCreate(event: FormEvent) {
    event.preventDefault()
    if (!categoryId) {
      onError('Crie uma categoria antes de lançar.')
      return
    }
    setCreating(true)
    onError(null)
    try {
      await transactionsApi.createTransaction({
        categoryId: Number(categoryId),
        description: description.trim(),
        amount: Number(amount),
        type,
        date,
        observation: observation.trim() || null,
      })
      setDescription('')
      setAmount('')
      setObservation('')
      onChanged()
    } catch (err) {
      onError(formatApiError(err))
    } finally {
      setCreating(false)
    }
  }

  async function onDelete(id: number) {
    setBusyId(id)
    onError(null)
    try {
      await transactionsApi.deleteTransaction(id)
      onChanged()
    } catch (err) {
      onError(formatApiError(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="panel fade-up">
      <form className="composer compact-form" onSubmit={onCreate}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="desc">Descrição</label>
            <input
              id="desc"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Mercado"
            />
          </div>
          <div className="field">
            <label htmlFor="amount">Valor</label>
            <input
              id="amount"
              required
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
            />
          </div>
          <div className="field">
            <label htmlFor="type">Tipo</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="cat">Categoria</label>
            <select
              id="cat"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
            >
              {categories.length === 0 && <option value="">Sem categorias</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="date">Data</label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="obs">Obs.</label>
            <input
              id="obs"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Opcional"
            />
          </div>
        </div>
        <div className="composer-actions">
          <button className="btn btn-primary" type="submit" disabled={creating || !categories.length}>
            {creating ? 'Salvando…' : 'Adicionar'}
          </button>
        </div>
      </form>

      <div className="filters row">
        <div className="field field-inline">
          <label htmlFor="f-type">Filtrar tipo</label>
          <select
            id="f-type"
            value={txType}
            onChange={(e) => setTxType(e.target.value as typeof txType)}
          >
            <option value="">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>
        <div className="field field-inline">
          <label htmlFor="f-cat">Filtrar cat.</label>
          <select
            id="f-cat"
            value={txCategory}
            onChange={(e) =>
              setTxCategory(e.target.value === '' ? '' : Number(e.target.value))
            }
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="empty">
          <strong>Nenhum lançamento</strong>
          Crie acima — vai pelo <code>POST /transactions</code>.
        </div>
      ) : (
        <ul className="tx-list">
          {transactions.map((tx, index) => {
            const cat = categoryMap.get(tx.categoryId)
            return (
              <li
                key={tx.id}
                className="tx-item"
                style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
              >
                <span
                  className="tx-dot"
                  style={{ background: cat?.color ?? '#888' }}
                  title={cat?.name}
                />
                <div className="tx-main">
                  <p className="tx-title">{tx.description}</p>
                  <p className="tx-meta">
                    {formatDateLabel(String(tx.date))} · {cat?.name ?? '—'} · {tx.type}
                  </p>
                </div>
                <strong className={`tx-amount ${tx.type}`}>
                  {tx.type === 'expense' ? '−' : '+'}
                  {formatMoney(tx.amount)}
                </strong>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={busyId === tx.id}
                  onClick={() => void onDelete(tx.id)}
                >
                  Apagar
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function CategoriesPanel({
  categories,
  onChanged,
  onError,
}: {
  categories: Category[]
  onChanged: () => void
  onError: (msg: string | null) => void
}) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLOR_OPTIONS[0])
  const [icon, setIcon] = useState<string>(ICON_OPTIONS[0])
  const [creating, setCreating] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)

  async function onCreate(event: FormEvent) {
    event.preventDefault()
    setCreating(true)
    onError(null)
    try {
      await categoriesApi.createCategory({
        name: name.trim(),
        color,
        icon,
      })
      setName('')
      onChanged()
    } catch (err) {
      onError(formatApiError(err))
    } finally {
      setCreating(false)
    }
  }

  async function onDelete(id: number) {
    setBusyId(id)
    onError(null)
    try {
      await categoriesApi.deleteCategory(id)
      onChanged()
    } catch (err) {
      onError(formatApiError(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="panel fade-up">
      <form className="composer compact-form" onSubmit={onCreate}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="cname">Nome</label>
            <input
              id="cname"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alimentação"
            />
          </div>
          <div className="field">
            <label htmlFor="cicon">Ícone</label>
            <select id="cicon" value={icon} onChange={(e) => setIcon(e.target.value)}>
              {ICON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Cor</label>
            <div className="color-row">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${color === c ? 'active' : ''}`}
                  style={{ background: c }}
                  aria-label={c}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="composer-actions">
          <button className="btn btn-primary" type="submit" disabled={creating}>
            {creating ? 'Criando…' : 'Nova categoria'}
          </button>
        </div>
      </form>

      {categories.length === 0 ? (
        <div className="empty">
          <strong>Nenhuma categoria</strong>
          Crie a primeira — <code>POST /categories</code>.
        </div>
      ) : (
        <ul className="cat-list">
          {categories.map((c, index) => (
            <li
              key={c.id}
              className="cat-item"
              style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
            >
              <span className="cat-swatch" style={{ background: c.color }} />
              <div>
                <p className="cat-title">{c.name}</p>
                <p className="cat-meta">{c.icon}</p>
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                disabled={busyId === c.id}
                onClick={() => void onDelete(c.id)}
              >
                Apagar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
