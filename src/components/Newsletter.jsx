import { useState } from 'react'

function Newsletter({ variant = 'section' }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    // No backend wired up yet — swap this for a real subscribe endpoint before launch.
    setSubmitted(true)
    setEmail('')
  }

  if (variant === 'footer') {
    return (
      <div className="footer-newsletter">
        {submitted ? (
          <p className="newsletter-success" style={{ color: '#ffffff' }}>
            Thanks — you're on the list!
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-accent btn-sm btn-block">
              Get Deal Alerts
            </button>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="newsletter">
      <h3>Get Notified About New Deals</h3>
      <p>Hand-picked tech deals and new Top Picks, straight to your inbox. No spam.</p>
      {submitted ? (
        <p className="newsletter-success">Thanks — you're on the list!</p>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-accent">
            Subscribe
          </button>
        </form>
      )}
    </div>
  )
}

export default Newsletter
