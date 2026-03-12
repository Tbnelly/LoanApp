import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return currentUser ? children : <Navigate to="/signin" replace />
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div style={{
        width: 40, height: 40, border: '4px solid #e5e7eb',
        borderTopColor: '#e94560', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p className="text-gray-400 mt-4 text-sm">Loading...</p>
    </div>
  )
}