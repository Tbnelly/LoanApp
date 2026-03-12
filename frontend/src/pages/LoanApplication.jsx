import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { saveLoanToFirestore } from '../services/loanService'
import Toast from '../components/Toast'
import { IoHome } from "react-icons/io5"
import { FaCreditCard } from "react-icons/fa6"
import { FaHospital } from "react-icons/fa6"
import { IoSchoolSharp } from "react-icons/io5"
import { MdBusinessCenter } from "react-icons/md"
import { IoCarSport } from "react-icons/io5"
import { TbPlaneDeparture } from "react-icons/tb"
import { GoChecklist } from "react-icons/go"
import { FaArrowRight } from "react-icons/fa"

// key = value saved to DB, label = short display text shown in pill
const LOAN_PURPOSES = [
  { key: 'Home Improvement',   label: 'Home',     icon: <IoHome /> },
  { key: 'Debt Consolidation', label: 'Debt',     icon: <FaCreditCard /> },
  { key: 'Medical Expenses',   label: 'Medical',  icon: <FaHospital /> },
  { key: 'Education',          label: 'Education',icon: <IoSchoolSharp /> },
  { key: 'Business',           label: 'Business', icon: <MdBusinessCenter /> },
  { key: 'Vehicle Purchase',   label: 'Vehicle',  icon: <IoCarSport /> },
  { key: 'Travel',             label: 'Travel',   icon: <TbPlaneDeparture /> },
  { key: 'Other',              label: 'Other',    icon: <GoChecklist /> },
]

export default function LoanApplication() {
  const { currentUser } = useAuth()
  const [loanAmount,   setLoanAmount]   = useState('')
  const [loanPurpose,  setLoanPurpose]  = useState('')
  const [loanTerm,     setLoanTerm]     = useState('')
  const [loanTermUnit, setLoanTermUnit] = useState('months')
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [toast,        setToast]        = useState(null)

  const closeToast = useCallback(() => setToast(null), [])

  const monthlyPayment = (() => {
    const amt  = Number(loanAmount)
    const term = Number(loanTerm)
    if (!amt || !term) return null
    const months = loanTermUnit === 'years' ? term * 12 : term
    const monthly = (amt * (1 + 0.08 * (months / 12))) / months
    return monthly.toFixed(2)
  })()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!loanAmount || isNaN(loanAmount) || Number(loanAmount) <= 0)
      return setError('Enter a valid loan amount greater than 0.')
    if (Number(loanAmount) > 1_000_000)
      return setError('Loan amount cannot exceed ₦1,000,000.')
    if (!loanPurpose)
      return setError('Please select a loan purpose.')
    if (!loanTerm || isNaN(loanTerm) || Number(loanTerm) <= 0)
      return setError('Enter a valid loan term.')

    setLoading(true)
    try {
      await saveLoanToFirestore(currentUser.uid, currentUser.email, {
        loanAmount: Number(loanAmount), loanPurpose,
        loanTerm: Number(loanTerm), loanTermUnit,
      })
      setLoanAmount(''); setLoanPurpose(''); setLoanTerm(''); setLoanTermUnit('months')
      setToast({ type: 'success', message: 'Application submitted! View it in your Loan History.' })
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: `Failed to submit: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  const selectedPurpose = LOAN_PURPOSES.find(p => p.key === loanPurpose)

  return (
    <div className="min-h-screen bg-navy-900 py-14 px-6">
      <Toast toast={toast} onClose={closeToast} />

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
            New Application
          </div>
          <h1 style={{ fontFamily: '"DM Serif Display", serif' }} className="text-4xl text-white font-normal mb-2">
            Loan Application
          </h1>
          <p className="text-white/40 text-sm">
            Fill in the details below — approval usually takes under 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">

          {/* ── Form card ── */}
          <div className="bg-navy-800 border border-white/[0.06] rounded-2xl p-8">

            {error && (
              <div className="error-box mb-6">
                <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Loan Amount */}
              <div>
                <label className="form-label">Loan Amount (₦)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-semibold pointer-events-none">₦</span>
                  <input
                    type="number" min="1" placeholder="0.00"
                    value={loanAmount} onChange={e => setLoanAmount(e.target.value)}
                    className="input-field pl-8"
                  />
                </div>
              </div>

              {/* Loan Purpose */}
              <div>
                <label className="form-label">Loan Purpose</label>
                <div className="grid grid-cols-4 gap-2">
                  {LOAN_PURPOSES.map(({ key, label, icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setLoanPurpose(key)}
                      title={key} // full name shows on hover
                      className={`flex flex-col items-center justify-center gap-2 py-3.5 px-1 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        loanPurpose === key
                          ? 'bg-brand-500/15 border-brand-500/50 text-brand-500'
                          : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70'
                      }`}
                    >
                      <span className="text-base leading-none">{icon}</span>
                      <span className="leading-tight text-center">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <label className="form-label">Loan Term</label>
                <div className="flex gap-3">
                  <input
                    type="number" min="1" placeholder="e.g. 12"
                    value={loanTerm} onChange={e => setLoanTerm(e.target.value)}
                    className="input-field flex-1"
                  />
                  <div className="flex rounded-xl border border-white/10 overflow-hidden shrink-0">
                    {['months', 'years'].map(unit => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => setLoanTermUnit(unit)}
                        className={`px-4 py-3 text-sm font-semibold capitalize transition-all duration-200 cursor-pointer border-none ${
                          loanTermUnit === unit
                            ? 'bg-brand-500 text-white'
                            : 'bg-white/[0.03] text-white/40 hover:text-white/70'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit Application
                      <FaArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Summary sidebar ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-navy-800 border border-white/[0.06] rounded-2xl p-6">
              <p className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-4">Estimate</p>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-white/35 mb-1">Loan amount</div>
                  <div className="text-xl font-bold text-white tracking-tight">
                    {loanAmount ? `₦${Number(loanAmount).toLocaleString()}` : '—'}
                  </div>
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div>
                  <div className="text-xs text-white/35 mb-1">Repayment term</div>
                  <div className="text-base font-semibold text-white/70">
                    {loanTerm ? `${loanTerm} ${loanTermUnit}` : '—'}
                  </div>
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div>
                  <div className="text-xs text-white/35 mb-1">Est. monthly payment</div>
                  <div className="text-xl font-bold text-brand-500">
                    {monthlyPayment ? `₦${Number(monthlyPayment).toLocaleString()}` : '—'}
                  </div>
                  {monthlyPayment && (
                    <div className="text-[10px] text-white/20 mt-1">~8% flat rate, indicative only</div>
                  )}
                </div>

                {selectedPurpose && (
                  <>
                    <div className="h-px bg-white/[0.06]" />
                    <div>
                      <div className="text-xs text-white/35 mb-1">Purpose</div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
                        <span className="text-base">{selectedPurpose.icon}</span>
                        {selectedPurpose.key}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Trust note */}
            <div className="bg-brand-500/[0.08] border border-brand-500/15 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <svg className="text-brand-500 shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <div>
                  <div className="text-xs font-semibold text-brand-500 mb-1">Secure & Private</div>
                  <div className="text-xs text-white/35 leading-relaxed">
                    Your data is encrypted and never shared with third parties without your consent.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}