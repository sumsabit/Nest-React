import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../hooks/useLanguage'
import { useAuth } from '../../../hooks/useAuth'
import api from '../../../services/api'
import './SearchBar.css'

const SearchBar = ({ onSearch, placeholder = 'Search laws, articles, or ask a question...' }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchType, setSearchType] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [recentSearches, setRecentSearches] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  const searchRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuth()

  // Load history
  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) setRecentSearches(JSON.parse(history).slice(0, 5))
  }, [])

  // Outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ❌ FIXED: removed /search/suggestions (backend doesn't support it)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)

      try {
        // OPTIONAL fallback: use chat for smart suggestion later
        setSuggestions([])
        setShowSuggestions(false)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [query, currentLanguage])

  const saveToHistory = (term) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)

    setRecentSearches(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))

    // ❌ removed backend call (/search/history does not exist)
  }

  const handleSearch = (e, searchTerm = query) => {
    e?.preventDefault()

    const trimmed = searchTerm.trim()
    if (!trimmed) return

    saveToHistory(trimmed)

    onSearch?.({ query: trimmed, type: searchType })

    navigate(`/search?q=${encodeURIComponent(trimmed)}&type=${searchType}`)

    setShowSuggestions(false)
    setShowHistory(false)
  }

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        setSelectedSuggestion(p => Math.min(p + 1, suggestions.length - 1))
      } else if (e.key === 'ArrowUp') {
        setSelectedSuggestion(p => Math.max(p - 1, -1))
      } else if (e.key === 'Enter' && selectedSuggestion >= 0) {
        const s = suggestions[selectedSuggestion]
        setQuery(s.text)
        handleSearch(null, s.text)
      }
    }
  }

  const clearSearch = () => {
    setQuery('')
    inputRef.current?.focus()
    setShowSuggestions(false)
    setShowHistory(true)
  }

  const handleHistoryClick = (term) => {
    setQuery(term)
    setShowHistory(false)
    handleSearch(null, term)
  }

  const clearHistory = () => {
    setRecentSearches([])
    localStorage.removeItem('searchHistory')

    // ❌ removed /search/history
  }

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSearch} className="search-form">

        <div className="search-input-wrapper">

          <span className="search-icon">
            {isLoading ? '⏳' : '🔍'}
          </span>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('search') || placeholder}
            className="search-input"
          />

          {query && (
            <button type="button" onClick={clearSearch}>✕</button>
          )}

          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="all">All</option>
            <option value="keyword">Keyword</option>
            <option value="natural">Natural</option>
          </select>

          <button type="submit">Search</button>
        </div>

      </form>

      {/* History only (safe) */}
      {showHistory && recentSearches.length > 0 && (
        <div>
          {recentSearches.map((t, i) => (
            <div key={i} onClick={() => handleHistoryClick(t)}>
              🕒 {t}
            </div>
          ))}

          <button onClick={clearHistory}>Clear</button>
        </div>
      )}
    </div>
  )
}

export default SearchBar