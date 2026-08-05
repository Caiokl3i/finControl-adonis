import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { formatApiError } from '../api/client'

type Mode = 'login' | 'signup'

export function AuthPage() {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (mode === 'login') await login(email, password)
      else await signup(name, email, password)
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-hero fade-up">
        <div className="brand-mark">
          <span className="brand-wave" aria-hidden />
        </div>
        <h1 className="brand">Fluxo</h1>
        <p>
          Controle financeiro pessoal com API Adonis de verdade — categorias, lançamentos e
          saldo mensal.
        </p>
      </section>

      <section className="auth-panel fade-up-delay">
        <div className="tabs" role="tablist" aria-label="Autenticação">
          <button
            type="button"
            className={`tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Criar conta
          </button>
        </div>

        <h2>{mode === 'login' ? 'Bem-vindo de volta' : 'Abra sua conta'}</h2>
        <p className="lead">
          {mode === 'login'
            ? 'POST /auth/login · guarda o Bearer token'
            : 'POST /auth/signup · já autentica'}
        </p>

        <form className="stack" onSubmit={onSubmit}>
          {mode === 'signup' && (
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Opcional"
                autoComplete="name"
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Enviando…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p className="hint">
          Backend <code>:3333</code> · frontend <code>:5173</code>
        </p>
      </section>
    </div>
  )
}
