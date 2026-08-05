import { AuthProvider, useAuth } from './auth/AuthContext'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'

function Gate() {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div className="loading-screen">Conectando com a API…</div>
  }

  return isAuthenticated ? <HomePage /> : <AuthPage />
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
