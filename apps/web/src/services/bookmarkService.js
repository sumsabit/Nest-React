import api from './api'

class BookmarkService {
  async getBookmarks() {
    const response = await api.get('/bookmarks')
    return response.data
  }

  async addBookmark(historyId) {
    const response = await api.post('/bookmarks', {
      historyId,
    })
    return response.data
  }

  async removeBookmark(bookmarkId) {
    const response = await api.delete(`/bookmarks/${bookmarkId}`)
    return response.data
  }

  async checkBookmark(historyId) {
    const response = await api.get(`/bookmarks/check/${historyId}`)
    return response.data
  }
}

export default new BookmarkService()