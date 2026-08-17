import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAdminAuth } from '../context/AdminAuthContext'

function MfaChallenge() {
  const { refreshAal, signOut } = useAdminAuth()
  const [factorId, setFactorId] = useState(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingFactor, setLoadingFactor] = useState(true)

  useEffect(() => {
    supabase.auth.mfa.listFactors().then(({ data, error }) => {
      if (error) {
        setError(error.message)
      } else {
        const totpFactor = data.totp[0]
        setFactorId(totpFactor?.id ?? null)
      }
      setLoadingFactor(false)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!factorId) return
    setError('')
    setSubmitting(true)

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    })

    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    await refreshAal()
  }

  if (loadingFactor) {
    return <div className="state-message">Loading...</div>
  }

  return (
    <div className="legal-page" style={{ maxWidth: '420px' }}>
      <h1>Enter Authentication Code</h1>
      <p style={{ marginBottom: '1.5rem' }}>
        Enter the 6-digit code from your authenticator app.
      </p>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="mfa-code">Authentication Code</label>
          <input
            type="text"
            id="mfa-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            autoFocus
            required
          />
        </div>
        {error && <div className="message error">{error}</div>}
        <div className="button-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || code.length !== 6}
          >
            {submitting ? 'Verifying...' : 'Verify'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={signOut}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default MfaChallenge
