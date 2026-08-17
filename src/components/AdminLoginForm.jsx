import { useState } from 'react'
import { supabase } from '../supabaseClient'

function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setSubmitting(false)
    if (error) {
      setError(error.message)
    }
    // On success, AdminAuthContext's onAuthStateChange listener updates the
    // session automatically and AdminGate re-renders to the next step.
  }

  return (
    <div className="legal-page" style={{ maxWidth: '420px' }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="admin-email">Email</label>
          <input
            type="email"
            id="admin-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="admin-password-field">Password</label>
          <input
            type="password"
            id="admin-password-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="message error">{error}</div>}
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

export default AdminLoginForm
