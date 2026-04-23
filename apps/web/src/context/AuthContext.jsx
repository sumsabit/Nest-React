import { createContext, useState, useEffect } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 🔥 INITIAL AUTH HYDRATION (MOST IMPORTANT)
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken()

      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        // ✅ ALWAYS VERIFY WITH BACKEND
        const data = await authService.getMe()
        setUser(data.user || data) // depends on your API shape

        // optional: sync cache
        localStorage.setItem('user', JSON.stringify(data.user || data))
      } catch (error) {
        console.error('Auth init failed:', error)

        // ❌ invalid token → logout
        await authService.logout()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // ✅ LOGIN
  const login = async (email, password) => {
    const data = await authService.login(email, password)

    setUser(data.user)
    return data
  }

  // ✅ REGISTER
  const register = async (userData) => {
    const data = await authService.register(userData)

    setUser(data.user)
    return data
  }

  // ✅ LOGOUT
  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  // ✅ UPDATE PROFILE
  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  // ✅ DERIVED STATES
  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}