import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useCategories } from '../hooks/useCategories'

function Navbar({ onAdminClick, isAdmin, onLogout }) {
  const { theme, toggleTheme } = useTheme()
  const categories = useCategories()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const goToCategory = (category) => {
    setDropdownOpen(false)
    setMobileOpen(false)
    navigate(`/shop?category=${encodeURIComponent(category)}`)
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
          <span className="navbar-logo-main">ATG Tech Picks</span>
          <span className="navbar-logo-sub">Curated by Auro Technology Group</span>
        </Link>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          &#9776;
        </button>

        <nav className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>
            Home
          </Link>

          <div className={`nav-dropdown ${dropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
            <button
              className="nav-dropdown-trigger"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              Shop <span className="nav-dropdown-caret">&#9660;</span>
            </button>
            {dropdownOpen && (
              <div className="nav-dropdown-menu">
                <Link to="/shop" onClick={() => setDropdownOpen(false)}>
                  All Products
                </Link>
                {categories.map((cat) => (
                  <a key={cat} onClick={() => goToCategory(cat)}>
                    {cat}
                  </a>
                ))}
              </div>
            )}
          </div>

          <Link to="/contact" className="nav-link" onClick={() => setMobileOpen(false)}>
            Contact
          </Link>
        </nav>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
          </button>
          {!isAdmin ? (
            <button className="btn btn-secondary btn-sm" onClick={onAdminClick}>
              Admin
            </button>
          ) : (
            <>
              <Link to="/admin" className="btn btn-secondary btn-sm">
                Dashboard
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
