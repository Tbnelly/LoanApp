import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserLoans, deleteLoan } from '../services/loanService'
import Toast from '../components/Toast'
import { IoHome } from "react-icons/io5";
import { FaCreditCard } from "react-icons/fa6";
import { FaHospital } from "react-icons/fa6";
import { IoSchoolSharp } from "react-icons/io5";
import { MdBusinessCenter } from "react-icons/md";
import { IoCarSport } from "react-icons/io5";
import { TbPlaneDeparture } from "react-icons/tb";
import { GoChecklist } from "react-icons/go";
import { TbChecklist } from "react-icons/tb";


const STATUS = {
  pending:  { label: 'Pending',  pill: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',  dot: 'bg-yellow-400' },
  approved: { label: 'Approved', pill: 'bg-green-500/10  text-green-400  border-green-500/20',   dot: 'bg-green-400'  },
  rejected: { label: 'Rejected', pill: 'bg-red-500/10    text-red-400    border-red-500/20',     dot: 'bg-red-400'    },
}

const PURPOSE_ICONS = {
  'Home Improvement': <IoHome />, 'Debt Consolidation': <FaCreditCard />, 'Medical Expenses': <FaHospital />,
  'Education': <IoSchoolSharp />, 'Business': <MdBusinessCenter />, 'Vehicle Purchase': <IoCarSport />, 'Travel': <TbPlaneDeparture />, 'Other': <GoChecklist />,
}

export default function LoanHistory() {
  const { currentUser } = useAuth()
  const [loans,      setLoans]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [toast,      setToast]      = useState(null)

  const closeToast = useCallback(() => setToast(null), [])

  const fetchLoans = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const data = await getUserLoans(currentUser.uid)
      setLoans(data)
    } catch (err) {
      if (!silent) setError(
        err.code === 'permission-denied'
          ? 'Permission denied — check your Firestore rules.'
          : `Could not load loans: ${err.message}`
      )
    } finally {
      if (!silent) setLoading(false)
    }
  }, [currentUser.uid])

  useEffect(() => { fetchLoans() }, [fetchLoans])

  useEffect(() => {
    const interval = setInterval(() => fetchLoans(true), 8000)
    return () => clearInterval(interval)
  }, [fetchLoans])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this loan application? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteLoan(id)
      setLoans(prev => prev.filter(l => l.id !== id))
      setToast({ type: 'success', message: 'Loan application deleted.' })
    } catch (err) {
      setToast({ type: 'error', message: `Could not delete: ${err.message}` })
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (ts) => {
    if (!ts) return 'N/A'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Summary stats
  const total     = loans.length
  const approved  = loans.filter(l => l.status === 'approved').length
  const totalAmt  = loans.reduce((sum, l) => sum + (l.loanAmount || 0), 0)

  return (
    <div className="min-h-screen bg-navy-900 py-12 px-6">
      <Toast toast={toast} onClose={closeToast} />

      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
              Your Applications
            </div>
            <h1 style={{ fontFamily: '"DM Serif Display", serif' }} className="text-4xl text-white font-normal mb-2">
              Loan History
            </h1>
            {!loading && (
              <p className="text-white/35 text-sm">
                {total} application{total !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <Link
            to="/apply"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-5 py-3 rounded-xl no-underline transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Application
          </Link>
        </div>

        {/* ── Summary stats (only when loans exist) ── */}
        {!loading && loans.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Applications', value: total },
              { label: 'Approved',           value: approved },
              { label: 'Total Requested',    value: `₦${totalAmt.toLocaleString()}` },
            ].map(s => (
              <div key={s.label} className="bg-navy-800 border border-white/[0.06] rounded-2xl px-6 py-5">
                <div className="text-2xl font-bold text-white tracking-tight mb-1">{s.value}</div>
                <div className="text-xs text-white/35 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center py-28 gap-4">
            <div className="w-10 h-10 border-2 border-white/10 border-t-brand-500 rounded-full animate-spin" />
            <p className="text-white/30 text-sm">Loading your loans…</p>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="error-box">
            <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && loans.length === 0 && (
          <div className="flex flex-col items-center py-28 text-center">
            <div className="w-20 h-20 bg-navy-800 border border-white/[0.06] rounded-2xl flex items-center justify-center text-3xl mb-6">
              <TbChecklist />
            </div>
            <h3 style={{ fontFamily: '"DM Serif Display", serif' }} className="text-2xl text-white font-normal mb-2">
              No applications yet
            </h3>
            <p className="text-white/35 text-sm mb-8 max-w-xs">
              You haven't applied for any loans yet. Get started in minutes.
            </p>
            <Link
              to="/apply"
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-7 py-3.5 rounded-xl no-underline transition-all"
            >
              Apply for your first loan →
            </Link>
          </div>
        )}

        {/* ── Loans grid ── */}
        {!loading && !error && loans.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loans.map(loan => {
              const s = STATUS[loan.status] || STATUS.pending
              return (
                <div
                  key={loan.id}
                  className="bg-navy-800 border border-white/[0.06] rounded-2xl p-6 flex flex-col hover:border-white/[0.12] transition-all duration-200"
                >
                  {/* Amount + status */}
                  <div className="flex items-start justify-between mb-5 gap-2">
                    <div>
                      <div className="text-xs text-white/30 uppercase tracking-widest mb-1">Amount</div>
                      <div className="text-2xl font-bold text-white tracking-tight">
                        ₦{loan.loanAmount?.toLocaleString()}
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shrink-0 ${s.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/[0.05] mb-4" />

                  {/* Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/30">Purpose</span>
                      <span className="font-medium text-white/70 flex items-center gap-1.5">
                        <span>{PURPOSE_ICONS[loan.loanPurpose] || '📋'}</span>
                        {loan.loanPurpose}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/30">Term</span>
                      <span className="font-medium text-white/70">{loan.loanTerm} {loan.loanTermUnit}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/30">Applied</span>
                      <span className="font-medium text-white/70">{formatDate(loan.createdAt)}</span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(loan.id)}
                    disabled={deletingId === loan.id}
                    className="mt-5 w-full py-2.5 border border-white/8 hover:border-red-500/40 hover:text-red-400 text-white/25 text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 bg-transparent cursor-pointer flex items-center justify-center gap-2"
                  >
                    {deletingId === loan.id ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                        Delete
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}