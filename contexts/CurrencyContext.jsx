'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const CurrencyContext = createContext()

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}

const currencies = {
  USD: { symbol: '$', name: 'US Dollar', rate: 1 },
  LKR: { symbol: 'Rs.', name: 'Sri Lankan Rupee', rate: 320 },
  INR: { symbol: '₹', name: 'Indian Rupee', rate: 83 }
}

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD')

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') || 'USD'
    setCurrency(savedCurrency)
  }, [])

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency)
    localStorage.setItem('currency', newCurrency)
  }

  const formatPrice = (amount) => {
    const curr = currencies[currency]
    const convertedAmount = amount * curr.rate
    return `${curr.symbol}${convertedAmount.toLocaleString()}`
  }

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      changeCurrency, 
      formatPrice, 
      currencies,
      currentCurrency: currencies[currency]
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}