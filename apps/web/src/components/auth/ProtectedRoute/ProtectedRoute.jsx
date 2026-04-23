import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Loader from '../../common/Loader/Loader'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isLoading } = useAuth()
  const token = localStorage.getItem('token')

  // 1. No token → force login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 2. Still loading user data
  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <Loader size="large" />
      </div>
    )
  }

  // 3. User not loaded / invalid session
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 4. Role check
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute