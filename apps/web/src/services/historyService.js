import api from './api'

class HistoryService {
  async getHistory() {
    const res = await api.get('/history')
    return res.data
  }

  async deleteHistory(id) {
    const res = await api.delete(`/history/${id}`)
    return res.data
  }
}

export default new HistoryService()
