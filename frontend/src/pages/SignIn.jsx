import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../services/authService";
import { FaArrowRight } from "react-icons/fa"

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return setError("Both fields are required.");
    setLoading(true);
    setError("");
    try {
      await signIn(form.email, form.password);
      navigate("/apply");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const friendlyError = (code) => {
    if (code === "auth/user-not-found")
      return "No account found with this email. Please sign up first.";
    if (code === "auth/wrong-password")
      return "Incorrect password. Please try again.";
    if (code === "auth/invalid-credential")
      return "No account found with this email. Please sign up first.";
    if (code === "auth/too-many-requests")
      return "Too many failed attempts. Please wait a few minutes.";
    if (code === "auth/user-disabled")
      return "This account has been disabled. Please contact support.";
    return "Something went wrong. Please try again.";
  };

  return (
    <div className="min-h-screen bg-navy-900 flex overflow-hidden">
      {/* ── Left panel (hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-navy-800 border-r border-white/6 p-14 relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />

        {/* Top: logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <span
            style={{ fontFamily: '"DM Serif Display", serif' }}
            className="text-white text-xl"
          >
            LoanApp
          </span>
        </div>

        {/* Middle: hero copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
            Secure &amp; Instant
          </div>

          <h2
            style={{ fontFamily: '"DM Serif Display", serif' }}
            className="text-5xl text-white leading-[1.1] mb-5 font-normal"
          >
            Your money,
            <br />
            <span className="text-brand-500 italic">your control.</span>
          </h2>

          <p className="text-white/40 text-base leading-relaxed max-w-xs">
            Flexible loan products designed around your life — fast approvals,
            transparent terms, zero hidden fees.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-10 mt-10">
            {[
              { value: "₦2B+", label: "Disbursed" },
              { value: "98%", label: "Approval Rate" },
              { value: "24h", label: "Processing" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-[10px] text-white/35 uppercase tracking-widest mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: decorative card */}
        <div className="relative z-10">
          <div className="bg-navy-700 border border-white/8 rounded-2xl p-6 max-w-xs">
            <div className="w-9 h-7 rounded-md bg-linear-to-br from-yellow-300 to-yellow-500 mb-8" />
            <div className="flex justify-end mb-6">
              <span
                style={{ fontFamily: '"DM Serif Display", serif' }}
                className="text-white/70 text-lg tracking-widest"
              >
                VISA
              </span>
            </div>
            <div className="font-mono text-white/60 text-sm tracking-[0.2em] mb-5">
              •••• •••• •••• 4291
            </div>
            <div className="flex justify-between text-xs text-white/35 uppercase tracking-widest">
              <span>J. Adeyemi</span>
              <span>09/28</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-14">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              L
            </div>
            <span
              style={{ fontFamily: '"DM Serif Display", serif' }}
              className="text-white text-xl"
            >
              LoanApp
            </span>
          </div>

          <h1
            style={{ fontFamily: '"DM Serif Display", serif' }}
            className="text-4xl text-white font-normal mb-2"
          >
            Welcome back
          </h1>
          <p className="text-white/40 text-sm mb-10">
            Sign in to continue to your account
          </p>

          {error && (
            <div className="error-box">
              <svg
                className="shrink-0 mt-0.5"
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 5v3M8 10.5v.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <>
                    Sign In
                    <FaArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-white/30 text-sm mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-brand-500 font-semibold hover:text-brand-400 no-underline transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
