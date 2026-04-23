import api from './api'

class SearchService {
  async search(query, userId) {
    const response = await api.post('/chat', {
      message: query,
      session_id: userId,
    })

    const answer =
      response.data.answer ||
      response.data.response ||
      response.data

    // ✅ Normalize into array (what UI expects)
    return {
      results: [
        {
          id: response.data.historyId || Date.now(),
          title: "AI Legal Assistant",
          content: answer,
          createdAt: new Date().toISOString(),
        }
      ],
      totalResults: 1,
      totalPages: 1,
    }
  }
}

export default new SearchService()