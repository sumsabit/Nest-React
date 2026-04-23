import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../hooks/useLanguage'
import { useAuth } from '../../../hooks/useAuth'
import Loader from '../../common/Loader/Loader'
import api from '../../../services/api'
import './SearchResults.css'

const SearchResults = ({ results, isLoading, totalResults, onPageChange, currentPage }) => {
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState('list')
  const [sortBy, setSortBy] = useState('relevance')
  const [bookmarkedItems, setBookmarkedItems] = useState([])
  const [hoveredItem, setHoveredItem] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [quickViewItem, setQuickViewItem] = useState(null)
  const [feedback, setFeedback] = useState({})

  const resultsRef = useRef([])

  // ✅ SAFE TEXT HANDLER (IMPORTANT FIX)
  const getText = (field) => {
    if (!field) return ''

    if (typeof field === 'object') {
      return field[currentLanguage] || field.en || Object.values(field)[0]
    }

    return field
  }

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('result-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    resultsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [results])

  // Check bookmark status
  useEffect(() => {
    if (user && results.length > 0) {
      checkBookmarks()
    }
  }, [results, user])

  const checkBookmarks = async () => {
    try {
      const ids = results.map(r => r.id)
      const response = await api.post('/bookmarks/check-bulk', { ids })
      setBookmarkedItems(response.data.bookmarked)
    } catch (error) {
      console.error('Failed to check bookmarks:', error)
    }
  }

  const handleBookmark = async (resultId, e) => {
    e?.stopPropagation()

    if (!user) {
      navigate('/login')
      return
    }

    try {
      if (bookmarkedItems.includes(resultId)) {
        await api.delete(`/bookmarks/${resultId}`)
        setBookmarkedItems(prev => prev.filter(id => id !== resultId))
      } else {
        await api.post('/bookmarks', { articleId: resultId })
        setBookmarkedItems(prev => [...prev, resultId])
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  const handleFeedback = async (resultId, type) => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await api.post(`/search/results/${resultId}/feedback`, { type })
      setFeedback(prev => ({ ...prev, [resultId]: type }))
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
  }

  const handleSelectItem = (resultId, e) => {
    e?.stopPropagation()
    setSelectedItems(prev =>
      prev.includes(resultId)
        ? prev.filter(id => id !== resultId)
        : [...prev, resultId]
    )
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handleQuickView = (result) => {
    setQuickViewItem(result)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  // LOADING
  if (isLoading) {
    return (
      <div className="search-results-loading">
        <Loader size="large" />
        <p>{t('searching') || 'Searching legal database...'}</p>
      </div>
    )
  }

  // EMPTY STATE
  if (!results || results.length === 0) {
    return (
      <div className="search-results-empty">
        <div className="empty-state-icon">🔍</div>
        <h3>{t('noResults') || 'No results found'}</h3>
        <p>{t('tryDifferentKeywords') || 'Try different keywords'}</p>
      </div>
    )
  }

  return (
    <div className="search-results">

      {/* HEADER */}
      <div className="results-header">
        <div className="results-info">
          <span>{totalResults} {t('results')}</span>
        </div>

        <select value={sortBy} onChange={handleSortChange}>
          <option value="relevance">Relevance</option>
          <option value="date">Date</option>
        </select>
      </div>

      {/* RESULTS */}
      <div className={`results-container results-${viewMode}`}>
        {results.map((result, index) => (
          <div
            key={result.id}
            ref={el => resultsRef.current[index] = el}
            className="result-card"
          >

            {/* TITLE */}
            <h3 className="result-title">
              <Link to={`/legal-content/${result.id}`}>
                {getText(result.title)}
              </Link>
            </h3>

            {/* EXCERPT */}
            <p className="result-excerpt">
              {getText(result.excerpt)}
            </p>

            {/* META */}
            <div className="result-meta">
              <span>🤖 AI Response</span>
              <span>{formatDate(result.createdAt)}</span>
            </div>

            {/* ACTIONS */}
            <div className="result-actions">

              {/* BOOKMARK */}
              <button
                onClick={(e) => handleBookmark(result.id, e)}
              >
                🔖 {bookmarkedItems.includes(result.id) ? 'Saved' : 'Save'}
              </button>

              {/* QUICK VIEW */}
              <button onClick={() => handleQuickView(result)}>
                👁️ View
              </button>

              {/* FEEDBACK */}
              {user && (
                <>
                  <button onClick={() => handleFeedback(result.id, 'helpful')}>👍</button>
                  <button onClick={() => handleFeedback(result.id, 'not-helpful')}>👎</button>
                </>
              )}

            </div>

          </div>
        ))}
      </div>

      {/* QUICK VIEW */}
      {quickViewItem && (
        <div className="modal-overlay" onClick={() => setQuickViewItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>

            <button onClick={() => setQuickViewItem(null)}>✕</button>

            <h3>{getText(quickViewItem.title)}</h3>

            <p>{getText(quickViewItem.excerpt)}</p>

          </div>
        </div>
      )}

    </div>
  )
}

export default SearchResults