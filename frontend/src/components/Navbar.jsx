import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logOut } from '../services/authService'

export default function Navbar() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logOut()
    navigate('/signin')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="glass-nav">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <span style={{ fontFamily: '"DM Serif Display", serif' }} className="text-white text-xl leading-none">
            LoanApp
          </span>
        </Link>

        {/* Nav links — only when logged in */}
        {currentUser && (
          <div className="flex items-center gap-1 flex-1 justify-center">
            <Link
              to="/apply"
              className={`nav-link ${isActive('/apply') ? 'nav-link-active' : ''}`}
            >
              {isActive('/apply') && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
              )}
              Apply
            </Link>
            <Link
              to="/history"
              className={`nav-link ${isActive('/history') ? 'nav-link-active' : ''}`}
            >
              {isActive('/history') && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
              )}
              History
            </Link>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-4 shrink-0">
          {currentUser ? (
            <>
              {/* Avatar + name */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(currentUser.displayName || currentUser.email || '?')[0].toUpperCase()}
                </div>
                <span className="text-white/60 text-sm font-medium hidden sm:block max-w-[140px] truncate">
                  {currentUser.displayName || currentUser.email}
                </span>
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-white/10" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-white/40 hover:text-brand-500 text-sm font-semibold transition-colors bg-transparent border-none cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-white/50 hover:text-white text-sm font-semibold no-underline transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-lg no-underline transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}