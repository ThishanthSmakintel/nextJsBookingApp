'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n'

const LocaleContext = createContext()

export const useLocale = () => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState('en')
  const [, forceUpdate] = useState({})

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en'
    if (savedLocale !== locale) {
      setLocale(savedLocale)
    }
  }, [])

  const changeLocale = (newLocale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    forceUpdate({})
  }

  const { t } = useTranslation(locale)

  return (
    <LocaleContext.Provider value={{ locale, changeLocale, t }} key={locale}>
      {children}
    </LocaleContext.Provider>
  )
}