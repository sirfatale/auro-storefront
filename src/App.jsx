import { useState, useEffect } from 'react'
import Storefront from './components/Storefront'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

function App() {
  const [view, setView] = useState('storefront')
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const handleAdminAccess = (password) => {
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
    if (password === correctPassword) {
      setIsAdmin(true)
      setAdminPassword(password)
      setView('dashboard')
      setShowPasswordForm(false)
    } else {
      alert('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setAdminPassword('')
    setView('storefront')
  }

  return (
    <>
      <header>
        <div className="header-content">
          <a href="#" className="logo" onClick={() => setView('storefront')}>
            AURO TECHNOLOGY GROUP STOREFRONT
          </a>
          <nav>
            <a href="#" onClick={() => setView('storefront')}>Home</a>
            {!isAdmin && (
              <button onClick={() => setShowPasswordForm(true)}>
                Admin
              </button>
            )}
            {isAdmin && (
              <>
                <a href="#" onClick={() => setView('dashboard')}>Dashboard</a>
                <button onClick={handleLogout}>Logout</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        {showPasswordForm && !isAdmin && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Admin Access</h2>
              <input
                type="password"
                placeholder="Enter admin password"
                id="admin-password"
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

        {view === 'storefront' && !isAdmin && <Storefront />}
        {view === 'dashboard' && isAdmin && (
          <AdminDashboard adminPassword={adminPassword} />
        )}
      </main>

      <footer>
        <p>&copy; 2024 Auro Technology Group. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
