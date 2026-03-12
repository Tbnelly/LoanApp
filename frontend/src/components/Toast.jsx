// Reusable Toast — import and use in any page
import { useEffect } from 'react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [toast, onClose])

  if (!toast) return null

  const isSuccess = toast.type === 'success'

  return (
    <div style={{
      position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: '12px',
      padding: '14px 20px', borderRadius: '16px', minWidth: '320px', maxWidth: '480px',
      background: '#1a1a2e', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      borderLeft: `4px solid ${isSuccess ? '#22c55e' : '#e94560'}`,
      animation: 'slideDown 0.3s ease-out',
    }}>
      <span style={{ fontSize: '1.2rem' }}>{isSuccess ? '✅' : '❌'}</span>
      <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500, flex: 1, margin: 0 }}>
        {toast.message}
      </p>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: '#9ca3af',
        fontSize: '1.1rem', cursor: 'pointer', padding: '0 4px', lineHeight: 1,
      }}>✕</button>
    </div>
  )
}