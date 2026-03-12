import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import LoanApplication from './pages/LoanApplication'
import LoanHistory from './pages/LoanHistory'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
          <Route path="/apply"   element={<PrivateRoute><LoanApplication /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><LoanHistory /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}