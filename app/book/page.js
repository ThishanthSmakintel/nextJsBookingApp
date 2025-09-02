'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BookingForm from '@/components/BookingForm'
import { useToast } from '@/components/Toast'
import Breadcrumb from '@/components/Breadcrumb'

export default function BookPage() {
  const [car, setCar] = useState(null)
  const [lockData, setLockData] = useState(null)
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const startDate = urlParams.get('startDate')
    const endDate = urlParams.get('endDate')
    
    // Validate dates
    if (!startDate || !endDate || startDate === 'null' || endDate === 'null') {
      router.push('/')
      return
    }
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      router.push('/')
      return
    }
    
    // Check if start date is in the past (more than 1 day ago)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (start < yesterday) {
      router.push('/')
      return
    }
    
    // Check if end date is before start date
    if (end <= start) {
      router.push('/')
      return
    }
    
    // Check if booking is more than 14 days
    const daysDiff = (end - start) / (1000 * 60 * 60 * 24)
    if (daysDiff > 14) {
      router.push('/')
      return
    }
    
    const selectedCar = localStorage.getItem('selectedCar')
    const storedLockData = localStorage.getItem('lockData')
    
    if (!selectedCar || !storedLockData) {
      router.push('/search')
      return
    }
    
    setCar(JSON.parse(selectedCar))
    setLockData(JSON.parse(storedLockData))
  }, [router])

  const handleConfirmBooking = async (bookingData) => {
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch('/api/bookings/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      })

      const booking = await res.json()
      
      if (res.ok) {
        localStorage.removeItem('selectedCar')
        localStorage.removeItem('lockData')
        localStorage.setItem('confirmedBooking', JSON.stringify(booking))
        
        // Always go to success page first, then payment if needed
        router.push('/booking-success')
      } else {
        if (booking.clearSession) {
          localStorage.clear()
          router.push('/login')
        } else {
          toast.error(booking.error)
        }
      }
    } catch (error) {
      toast.error('Booking confirmation failed')
    }
  }

  if (!car || !lockData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-gray-600">Loading your booking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Search Cars', href: '/search' },
          { label: 'Book Car' }
        ]} />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Secure your ride in just a few steps</p>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center">
            <div className="flex-1 h-2 bg-primary rounded-full"></div>
            <div className="w-4 h-4 bg-primary rounded-full mx-2"></div>
            <div className="flex-1 h-2 bg-primary rounded-full"></div>
            <div className="w-4 h-4 bg-primary rounded-full mx-2"></div>
            <div className="flex-1 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Select</span>
            <span>Book</span>
            <span>Confirm</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Car Details Card */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">{car.make} {car.model}</h2>
                <p className="opacity-90">{car.year} • {car.category}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-600">Capacity</span>
                    </div>
                    <span className="font-semibold">{car.capacity} passengers</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-600">Location</span>
                    </div>
                    <span className="font-semibold">{car.location?.name || 'Main Location'}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 mt-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Pricing</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Rate</span>
                        <span className="font-bold text-green-600">${car.dailyRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Per KM</span>
                        <span className="font-bold text-green-600">${car.kmRate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Form */}
          <div className="xl:col-span-2">
            <BookingForm 
              car={car} 
              lockData={lockData} 
              onConfirm={handleConfirmBooking} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}