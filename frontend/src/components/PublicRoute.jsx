import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div style={{
        width: 40, height: 40, border: '4px solid #e5e7eb',
        borderTopColor: '#e94560', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
    </div>
  )
  return currentUser ? <Navigate to="/apply" replace /> : children
}