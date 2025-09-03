'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

export default function SearchableSelect({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select...", 
  searchPlaceholder = "Search...",
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)

  const filteredOptions = options.filter(option =>
    option?.label?.toLowerCase().includes(search.toLowerCase())
  )

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`dropdown w-full ${className}`} ref={dropdownRef}>
      <div 
        tabIndex={0} 
        className="input input-bordered flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-base-content' : 'text-base-content/50'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-auto">
          <div className="form-control mb-2">
            <div className="input-group">
              <span className="text-base-content"><Search className="w-4 h-4" /></span>
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="input input-bordered input-sm w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-center text-base-content/50">No options found</div>
          ) : (
            filteredOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={`w-full text-left p-2 hover:bg-base-200 ${value === option.value ? 'bg-primary text-primary-content' : 'text-base-content'}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onChange(option.value)
                    setIsOpen(false)
                    setSearch('')
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </div>
      )}
    </div>
  )
}