import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import BookmarkList from '../../components/bookmarks/BookmarkList/BookmarkList'
import Loader from '../../components/common/Loader/Loader'
import api from '../../services/api'
import './BookmarksPage.css'

const BookmarksPage = () => {
  const { user } = useAuth()
  const { currentLanguage, t } = useLanguage()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchAllData()
  }, [user])

  // ✅ ONLY REAL BACKEND CALLS
  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/bookmarks')

      setStats({
        totalBookmarks: res.data.total || 0,
      })
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
    } finally {
      setIsLoading(false)
    }
  }hostname -I

  const handleExport = async () => {
    setIsExporting(true)
    try {
     const res = await api.get('/bookmarks')

setStats({
  totalBookmarks: res.data.total || 0,
})
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bookmarks.json'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Bookmarks',
          text: 'Saved legal content',
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied!')
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="bookmarks-page-loading">
        <Loader size="large" />
        <p>{t('loadingBookmarks') || 'Loading bookmarks...'}</p>
      </div>
    )
  }

  return (
    <div className="bookmarks-page">

      {/* HEADER */}
      <section className="bookmarks-header">
        <div className="header-content">
          <h1>
            {currentLanguage === 'en' && 'My Bookmarks'}
            {currentLanguage === 'am' && 'የእኔ ዕልባቶች'}
            {currentLanguage === 'om' && 'Qabiyyee Ko'}
          </h1>

          <p>
            {currentLanguage === 'en' && 'Your saved legal content'}
            {currentLanguage === 'am' && 'የተቀመጡ የሕግ ይዘቶች'}
            {currentLanguage === 'om' && 'Qabiyyee seeraa kayyoo'}
          </p>
        </div>

        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-icon">📚</span>
            <div>
              <strong>{stats.totalBookmarks || 0}</strong>
              <small>{t('total')}</small>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <section className="bookmarks-list-section">
        <div className="list-header">
          <h2>{t('allBookmarks') || 'All Bookmarks'}</h2>

          <div className="list-actions">
            <button
              className="action-btn export"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? '⏳ Exporting...' : '📥 Export'}
            </button>

            <button className="action-btn share" onClick={handleShare}>
              📤 Share
            </button>
          </div>
        </div>

        {/* LIST */}
        <BookmarkList />
      </section>

    </div>
  )
}

export default BookmarksPage