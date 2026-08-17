import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAdminAuth } from '../context/AdminAuthContext'

function MfaEnroll() {
  const { refreshAal, signOut } = useAdminAuth()
  const [factorId, setFactorId] = useState(null)
  const [qrCode, setQrCode] = useState(null)
  const [secret, setSecret] = useState(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingEnroll, setLoadingEnroll] = useState(true)

  const startEnrollment = async () => {
    setLoadingEnroll(true)
    setError('')
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
    if (error) {
      setError(error.message)
    } else {
      setFactorId(data.id)
      setQrCode(data.totp.qr_code)
      setSecret(data.totp.secret)
    }
    setLoadingEnroll(false)
  }

  useEffect(() => {
    startEnrollment()
  }, [])

  const handleVerify = async (e) => {
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

  const handleStartOver = async () => {
    if (factorId) {
      await supabase.auth.mfa.unenroll({ factorId })
    }
    setCode('')
    startEnrollment()
  }

  if (loadingEnroll) {
    return <div className="state-message">Setting up...</div>
  }

  return (
    <div className="legal-page" style={{ maxWidth: '480px' }}>
      <h1>Set Up Two-Factor Authentication</h1>
      <p style={{ marginBottom: '1rem' }}>
        This account doesn't have an authenticator app set up yet. Scan this QR code
        with Google Authenticator, Authy, or a similar app, then enter the 6-digit code
        it generates to finish setup.
      </p>

      {error && <div className="message error">{error}</div>}

      {qrCode && (
        <div
          className="image-preview"
          style={{ maxWidth: '220px', margin: '0 auto 1.5rem', padding: '1rem' }}
          dangerouslySetInnerHTML={{ __html: qrCode }}
        />
      )}

      {secret && (
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          Can't scan? Enter this code manually: <br />
          <code>{secret}</code>
        </p>
      )}

      <form onSubmit={handleVerify} className="product-form">
        <div className="form-group">
          <label htmlFor="enroll-code">6-Digit Code</label>
          <input
            type="text"
            id="enroll-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            autoFocus
            required
          />
        </div>
        <div className="button-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || code.length !== 6}
          >
            {submitting ? 'Verifying...' : 'Verify & Finish'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleStartOver}>
            Start Over
          </button>
          <button type="button" className="btn btn-secondary" onClick={signOut}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default MfaEnroll
