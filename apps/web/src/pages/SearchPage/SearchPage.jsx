import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import SearchBar from '../../components/search/SearchBar/SearchBar'
import SearchResults from '../../components/search/SearchResults/SearchResults'
import Loader from '../../components/common/Loader/Loader'
import api from '../../services/api'
import './SearchPage.css'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { currentLanguage, t } = useLanguage()
  const { user } = useAuth()

  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    category: 'all',
    language: 'all',
    date: 'all',
    type: 'all'
  })
  const [searchHistory, setSearchHistory] = useState([])
  const [activeFilter, setActiveFilter] = useState(null)
  const [error, setError] = useState(null)

  const filtersRef = useRef(null)

  const query = searchParams.get('q') || ''
const performSearch = useCallback(async () => {
  if (!query) return

  setIsLoading(true)
  setError(null)

  try {
    const res = await api.post('/chat', {
      message: query,
      session_id: user?.id,
    })

    // ✅ EXACTLY what backend returns
    const answer = res.data.answer
    const historyId = res.data.historyId

    // ✅ Minimal transformation (UI-friendly only)
    const formattedResults = [
      {
        id: historyId || Date.now(),
        title: "AI Legal Assistant",
        excerpt: answer,
        createdAt: new Date().toISOString(),
      }
    ]

    setResults(formattedResults)
    setTotalResults(1)

    saveSearchToHistory(query)

  } catch (err) {
    console.error(err)
    setError('AI service unavailable. Try again later.')
    setResults([])
  } finally {
    setIsLoading(false)
  }
}, [query, user])

  useEffect(() => {
    performSearch()
  }, [performSearch])

  // ✅ Local history only (no backend)
  const saveSearchToHistory = (term) => {
    const updated = [term, ...searchHistory.filter(s => s !== term)].slice(0, 5)
    setSearchHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const loadSearchHistory = () => {
    const history = localStorage.getItem('searchHistory')
    if (history) setSearchHistory(JSON.parse(history))
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  useEffect(() => {
    loadSearchHistory()
  }, [])

  // UI interactions
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
    setCurrentPage(1)
    setActiveFilter(null)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleFilter = (filterName) => {
    setActiveFilter(activeFilter === filterName ? null : filterName)
  }

  // Dummy categories (UI only)
  const categories = [
    { id: 'criminal', name: t('criminalLaw'), icon: '⚖️' },
    { id: 'family', name: t('familyLaw'), icon: '👨‍👩‍👧‍👦' },
    { id: 'labor', name: t('laborLaw'), icon: '💼' }
  ]

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'am', name: 'አማርኛ' },
    { id: 'om', name: 'Afaan Oromoo' }
  ]

  return (
    <div className="search-page">

      {/* HEADER */}
      <section className="search-header">
        <h1>🔍 Search Ethiopian Laws</h1>

        <SearchBar
          onSearch={({ query }) =>
            setSearchParams({ q: query })
          }
        />

        {query && (
          <p>
            Results for "<strong>{query}</strong>" ({totalResults})
          </p>
        )}
      </section>

      <div className="search-layout">

        {/* FILTERS */}
        <aside className="search-filters" ref={filtersRef}>
          <h3>Filters</h3>

          <div>
            <h4 onClick={() => toggleFilter('category')}>Category</h4>
            {activeFilter === 'category' &&
              categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleFilterChange('category', c.id)}
                >
                  {c.icon} {c.name}
                </button>
              ))}
          </div>

          <div>
            <h4 onClick={() => toggleFilter('language')}>Language</h4>
            {activeFilter === 'language' &&
              languages.map(l => (
                <button
                  key={l.id}
                  onClick={() => handleFilterChange('language', l.id)}
                >
                  {l.name}
                </button>
              ))}
          </div>
        </aside>

        {/* MAIN */}
        <main className="search-main">

          {isLoading && <Loader />}

          {error && (
            <div className="error">
              {error}
              <button onClick={performSearch}>Retry</button>
            </div>
          )}

          {!query && searchHistory.length > 0 && (
            <div>
              <h3>Recent Searches</h3>
              {searchHistory.map((term, i) => (
                <button
                  key={i}
                  onClick={() => setSearchParams({ q: term })}
                >
                  {term}
                </button>
              ))}
              <button onClick={clearHistory}>Clear</button>
            </div>
          )}

          {query && (
            <SearchResults
              results={results}
              isLoading={isLoading}
              totalResults={totalResults}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}

        </main>
      </div>
    </div>
  )
}

export default SearchPage