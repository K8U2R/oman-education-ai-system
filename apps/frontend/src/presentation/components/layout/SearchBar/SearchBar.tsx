import React, { useRef, useEffect, useState } from 'react'
import { Search, X, Loader2, Clock, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearch } from '../hooks/useSearch'
import { SearchResult } from '../types'

import { cn } from '@/presentation/components/ui/utils/classNames'
import styles from './SearchBar.module.scss'

const SearchBar: React.FC = () => {
  const { t } = useTranslation('common')
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

  // Keyboard Shortcut: Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setIsExpanded(true)
        setIsOpen(true)
        inputRef.current?.focus()
      }

      // Escape to close
      if (event.key === 'Escape' && (isOpen || isExpanded)) {
        setIsExpanded(false)
        setIsOpen(false)
        clearSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isExpanded, setIsOpen, clearSearch])

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
    <div
      className={cn(styles.container, isExpanded && styles['container--expanded'])}
      ref={searchRef}
    >
      {/* Mobile: Icon only button */}
      <button
        className={cn(styles.mobileTrigger, 'md:hidden')}
        onClick={handleSearchClick}
        aria-label={t('search.actions.open')}
      >
        <Search className={styles.icon} />
      </button>

      {/* Desktop: Full search bar, Mobile: Expandable container */}
      <div
        className={cn(
          styles.searchBar,
          (isOpen || isExpanded) && styles['searchBar--open']
        )}
        onClick={() => {
          setIsExpanded(true)
          setIsOpen(true)
        }}
      >
        <Search className={styles.icon} />
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={t('search.placeholder')}
          value={query}
          onChange={e => search(e.target.value)}
          onFocus={() => {
            setIsExpanded(true)
            setIsOpen(true)
          }}
        />
        {query && (
          <button
            className={styles.clearButton}
            onClick={e => {
              e.stopPropagation()
              clearSearch()
            }}
            aria-label={t('search.actions.clear')}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        )}
        {isExpanded && (
          <button
            className={styles.closeButton}
            onClick={e => {
              e.stopPropagation()
              handleSearchClose()
            }}
            aria-label={t('search.actions.close')}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {(isOpen || isExpanded) && (
        <div className={styles.results}>
          {isLoading ? (
            <div className={styles.emptyState}>
              <div className={styles.loadingSpinner} />
              <p>{t('search.status.searching')}</p>
            </div>
          ) : query.trim().length > 0 ? (
            hasResults ? (
              <>
                <div className={styles.resultsHeader}>
                  <span>{t('search.status.results_count', { count: results.length })}</span>
                </div>
                <div className={styles.resultsList}>
                  {results.map(result => (
                    <div
                      key={result.id}
                      className={styles.resultItem}
                      onClick={() => handleResultClick(result)}
                    >
                      <span className={styles.resultIcon}>{getResultIcon(result.type)}</span>
                      <div className={styles.resultContent}>
                        <h4 className={styles.resultTitle}>{result.title}</h4>
                        <p className={styles.resultDesc}>{result.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>{t('search.status.no_results')}</p>
              </div>
            )
          ) : history.length > 0 ? (
            <div className="p-2">
              <div className={styles.historyHeader}>
                <span>{t('search.history.title')}</span>
                <button onClick={clearHistory}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              {history.map((item, index) => (
                <div key={index} className={styles.resultItem} onClick={() => search(item)}>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className={styles.resultTitle}>{item}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar
