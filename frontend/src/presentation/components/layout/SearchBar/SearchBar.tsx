import React, { useRef, useEffect, useState } from 'react'
import { Search, X, Loader2, Clock, Trash2 } from 'lucide-react'
import { useSearch } from '../hooks/useSearch'
import { SearchResult } from '../types'
import './SearchBar.scss'

const SearchBar: React.FC = () => {
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    query,
    results,
    isLoading,
    isOpen,
    hasResults,
    history,
    search,
    clearSearch,
    clearHistory,
    handleResultClick,
    setIsOpen,
  } = useSearch()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsExpanded(false)
      }
    }

    if (isOpen || isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
      if (isExpanded) {
        inputRef.current?.focus()
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isExpanded, setIsOpen])

  useEffect(() => {
    if (query.trim().length > 0) {
      search(query)
    } else {
      clearSearch()
    }
  }, [query, search, clearSearch])

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'lesson':
        return '📚'
      case 'student':
        return '👤'
      case 'subject':
        return '📖'
      case 'user':
        return '👥'
      default:
        return '🔍'
    }
  }

  const handleSearchClick = () => {
    setIsExpanded(true)
    setIsOpen(true)
  }

  const handleSearchClose = () => {
    setIsExpanded(false)
    setIsOpen(false)
    clearSearch()
  }

  return (
    <div className={`search-bar ${isExpanded ? 'search-bar--expanded' : ''}`} ref={searchRef}>
      {/* Mobile: Icon only button */}
      <button
        className="search-bar__mobile-trigger"
        onClick={handleSearchClick}
        aria-label="فتح البحث"
      >
        <Search className="search-bar__icon" />
      </button>

      {/* Desktop: Full search bar, Mobile: Expandable container */}
      <div
        className={`search-bar__container ${isOpen || isExpanded ? 'search-bar__container--open' : ''}`}
        onClick={() => {
          setIsExpanded(true)
          setIsOpen(true)
        }}
      >
        <Search className="search-bar__icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-bar__input"
          placeholder="ابحث عن دروس، مواد، طلاب..."
          value={query}
          onChange={e => search(e.target.value)}
          onFocus={() => {
            setIsExpanded(true)
            setIsOpen(true)
          }}
        />
        {query && (
          <button
            className="search-bar__clear"
            onClick={e => {
              e.stopPropagation()
              clearSearch()
            }}
            aria-label="مسح البحث"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
          </button>
        )}
        {isExpanded && (
          <button
            className="search-bar__close-mobile"
            onClick={e => {
              e.stopPropagation()
              handleSearchClose()
            }}
            aria-label="إغلاق البحث"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {(isOpen || isExpanded) && (
        <div className="search-bar__results">
          {isLoading ? (
            <div className="search-bar__loading">
              <Loader2 className="search-bar__loading-icon" />
              <p className="search-bar__loading-text">جاري البحث...</p>
            </div>
          ) : query.trim().length > 0 ? (
            hasResults ? (
              <>
                <div className="search-bar__results-header">
                  <span className="search-bar__results-count">{results.length} نتيجة</span>
                </div>
                <div className="search-bar__results-list">
                  {results.map(result => (
                    <div
                      key={result.id}
                      className="search-bar__result"
                      onClick={() => handleResultClick(result)}
                    >
                      <span className="search-bar__result-icon">{getResultIcon(result.type)}</span>
                      <div className="search-bar__result-content">
                        <h4 className="search-bar__result-title">{result.title}</h4>
                        <p className="search-bar__result-description">{result.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="search-bar__empty">
                <p className="search-bar__empty-text">لا توجد نتائج</p>
              </div>
            )
          ) : history.length > 0 ? (
            <>
              <div className="search-bar__history-header">
                <span className="search-bar__history-title">سجل البحث</span>
                <button
                  className="search-bar__history-clear"
                  onClick={clearHistory}
                  aria-label="مسح السجل"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="search-bar__history-list">
                {history.map((item, index) => (
                  <button
                    key={index}
                    className="search-bar__history-item"
                    onClick={() => search(item)}
                  >
                    <Clock className="search-bar__history-icon" />
                    <span className="search-bar__history-text">{item}</span>
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar
