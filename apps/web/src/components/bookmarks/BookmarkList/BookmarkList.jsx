import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Loader from '../../common/Loader/Loader'
import api from '../../../services/api'
import './BookmarkList.css'

const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [total, setTotal] = useState(0)

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) fetchBookmarks()
  }, [user])

 const fetchBookmarks = async () => {
  setIsLoading(true);
  try {
    const res = await api.get('/bookmarks');

    setBookmarks(res.data.items || []);
    setTotal(res.data.total || 0);
  } catch (error) {
    console.error('Failed to fetch bookmarks:', error);
    setBookmarks([]);
  } finally {
    setIsLoading(false);
  }
};

  const removeBookmark = async (id, e) => {
    e?.stopPropagation()

    try {
      await api.delete(`/bookmarks/${id}`)

      setBookmarks(prev => prev.filter(b => b.id !== id))
      setSelected(prev => prev.filter(x => x !== id))
      setTotal(prev => prev - 1)
    } catch (error) {
      console.error(error)
    }
  }

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selected.length === bookmarks.length) {
      setSelected([])
    } else {
      setSelected(bookmarks.map(b => b.id))
    }
  }

  if (isLoading) {
    return <Loader size="large" />
  }

  if (!user) {
    return <div>Please login</div>
  }

  if (bookmarks.length === 0) {
    return <div>No bookmarks yet</div>
  }

  return (
    <div className="bookmarks-container">

      {/* TOOLBAR */}
      <div className="bookmarks-toolbar">
        <label>
          <input
            type="checkbox"
            checked={selected.length === bookmarks.length}
            onChange={selectAll}
          />
          Select All ({selected.length})
        </label>
      </div>

      {/* LIST */}
      <div className="bookmarks-grid">
        {bookmarks.map(b => (
          <div key={b.id} className="bookmark-card">

            <input
              type="checkbox"
              checked={selected.includes(b.id)}
              onChange={() => toggleSelect(b.id)}
            />

            <div
              className="bookmark-content"
              onClick={() => navigate(`/legal-content/${b.history?.id}`)}
            >
              <h3>{b.history?.title || 'Untitled'}</h3>

              <p>
                {b.history?.content?.slice(0, 120) || ''}
              </p>

              <button onClick={(e) => removeBookmark(b.id, e)}>
                Remove
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default BookmarkList