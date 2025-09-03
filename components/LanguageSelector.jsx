'use client'
import { useLocale } from '@/contexts/LocaleContext'
import { getAvailableLocales } from '@/lib/i18n'
import { Globe } from 'lucide-react'

const localeNames = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  ta: 'தமிழ்',
  si: 'සිංහල'
}

export default function LanguageSelector() {
  const { locale, changeLocale } = useLocale()
  const availableLocales = getAvailableLocales()

  return (
    <select 
      className="select select-sm" 
      value={locale} 
      onChange={(e) => {
        console.log('Language changed to:', e.target.value)
        changeLocale(e.target.value)
      }}
    >
      {availableLocales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc] || loc} {locale === loc ? '✓' : ''}
        </option>
      ))}
    </select>
  )
}