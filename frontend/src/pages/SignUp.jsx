import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../services/authService'
import Toast from '../components/Toast'
import { FaArrowRight } from "react-icons/fa"

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm]               = useState({ fullName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [toast, setToast]             = useState(null)

  const closeToast = useCallback(() => setToast(null), [])

  const validate = () => {
    if (!form.fullName.trim())     return 'Full name is required.'
    if (!form.email.includes('@')) return 'Enter a valid email address.'
    if (form.password.length < 6)  return 'Password must be at least 6 characters.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return setError(err)

    setLoading(true)
    setError('')
    try {
      await signUp(form.fullName, form.email, form.password)
      setToast({ type: 'success', message: `Welcome, ${form.fullName}! Your account has been created.` })
      setTimeout(() => navigate('/apply'), 1800)
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const friendlyError = (code) => {
    if (code === 'auth/email-already-in-use') return 'This email is already registered. Try signing in instead.'
    if (code === 'auth/invalid-email')        return 'Invalid email address.'
    if (code === 'auth/weak-password')        return 'Password is too weak. Use at least 6 characters.'
    return 'Something went wrong. Please try again.'
  }

  return (
    <div className="min-h-screen bg-navy-900 flex overflow-hidden">
      <Toast toast={toast} onClose={closeToast} />

      
      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-navy-800 border-r border-white/6 p-14 relative overflow-hidden">

        
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />

        
        <div className="flex items-center gap-2.5 relative z-10">
          <span style={{ fontFamily: '"DM Serif Display", serif' }} className="text-white text-xl">LoanApp</span>
        </div>

        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest mb-8">
            Join thousands of users
          </div>

          <h2 style={{ fontFamily: '"DM Serif Display", serif' }} className="text-5xl text-white leading-[1.1] mb-5 font-normal">
            Start your<br />
            <span className="text-brand-500 italic">journey today.</span>
          </h2>

          <p className="text-white/40 text-base leading-relaxed max-w-xs">
            Create your account in seconds and get access to fast, flexible loan
            products with transparent terms.
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-5 mt-10">
            {[
              { num: '01', title: 'Create your account',   desc: 'Sign up in under a minute' },
              { num: '02', title: 'Submit your application', desc: 'Fill out a simple online form' },
              { num: '03', title: 'Get funded',             desc: 'Receive funds within 24 hours' },
            ].map(step => (
              <div key={step.num} className="flex items-start gap-4">
                <span className="text-xs font-bold text-brand-500/60 tracking-widest mt-0.5 shrink-0">{step.num}</span>
                <div>
                  <div className="text-sm font-semibold text-white/80">{step.title}</div>
                  <div className="text-xs text-white/35 mt-0.5">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: trust badges */}
        <div className="relative z-10 flex items-center gap-6">
          {['256-bit SSL', 'NDIC Insured', 'No hidden fees'].map(badge => (
            <div key={badge} className="flex items-center gap-1.5 text-xs text-white/30 font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-brand-500/60">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-14">
        <div className="w-full max-w-sm">

          {/* Mobile-only logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">L</div>
            <span style={{ fontFamily: '"DM Serif Display", serif' }} className="text-white text-xl">LoanApp</span>
          </div>

          <h1 style={{ fontFamily: '"DM Serif Display", serif' }} className="text-4xl text-white font-normal mb-2">
            Create account
          </h1>
          <p className="text-white/40 text-sm mb-10">Sign up to apply for a loan</p>

          {error && (
            <div className="error-box">
              <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="input-field"
              />
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field"
              />
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength hint */}
              {form.password.length > 0 && (
                <div className="flex items-center gap-2 mt-2.5">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        form.password.length >= i * 4
                          ? i === 1 ? 'bg-red-500' : i === 2 ? 'bg-yellow-500' : 'bg-green-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] text-white/35 ml-1">
                    {form.password.length < 4 ? 'Weak' : form.password.length < 8 ? 'Fair' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                    <>
                     Create Account
                      <FaArrowRight size={13} />
                    </>
                  )}
              </button>
            </div>
          </form>

          <p className="text-center text-white/30 text-sm mt-8">
            Already have an account?{' '}
            <Link to="/signin" className="text-brand-500 font-semibold hover:text-brand-400 no-underline transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}