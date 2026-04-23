import api from './api'

class AuthService {
 async login(email, password) {
  const response = await api.post('/auth/login', {
    email,
    password
  })

  const { token, user } = response.data

if (token) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

  return response.data
}
async getMe() {
  const response = await api.get('/auth/me')
  return response.data
}
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      throw error
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

   async updateProfile(userData) {
    const response = await api.patch('/user/profile', userData)

    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
  }
  async changePassword(passwordData) {
  const token = localStorage.getItem('token');

  const response = await api.post(
    '/auth/change-password',
    passwordData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/verify-email', { token })
      return response.data
    } catch (error) {
      throw error
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  isAdmin() {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  }
}

export default new AuthService()