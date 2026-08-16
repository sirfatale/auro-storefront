import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import DisclosureBanner from './components/DisclosureBanner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Contact from './pages/Contact'
import AffiliateDisclosure from './pages/AffiliateDisclosure'
import PrivacyPolicy from './pages/PrivacyPolicy'
import AdminDashboard from './components/AdminDashboard'

function AdminGate({ onLoginClick }) {
  return (
    <div className="state-message">
      <p style={{ marginBottom: '1rem' }}>Admin access required.</p>
      <button className="btn btn-primary" onClick={onLoginClick}>
        Log In
      </button>
    </div>
  )
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const navigate = useNavigate()

  const handleAdminAccess = (password) => {
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
    if (password === correctPassword) {
      setIsAdmin(true)
      setShowPasswordForm(false)
      navigate('/admin')
    } else {
      alert('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    navigate('/')
  }

  return (
    <ThemeProvider>
      <DisclosureBanner />
      <Navbar
        onAdminClick={() => setShowPasswordForm(true)}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      {showPasswordForm && !isAdmin && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Admin Access</h2>
            <input
              type="password"
              placeholder="Enter admin password"
              id="admin-password"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAdminAccess(e.target.value)
                }
              }}
            />
            <div className="modal-buttons">
              <button
                className="btn btn-primary"
                onClick={() => {
                  const pwd = document.getElementById('admin-password').value
                  handleAdminAccess(pwd)
                }}
              >
                Login
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowPasswordForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminDashboard />
              ) : (
                <AdminGate onLoginClick={() => setShowPasswordForm(true)} />
              )
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </ThemeProvider>
  )
}

export default App
