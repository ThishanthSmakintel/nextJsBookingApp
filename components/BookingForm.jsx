'use client'
import { useState, useEffect } from 'react'
import CountdownTimer from './CountdownTimer'
import { useConfirm } from '@/components/Toast'

export default function BookingForm({ car, lockData, onConfirm }) {

  
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    pricingMode: 'daily',
    estimatedKm: 0,
    withDriver: false,
    paymentType: 'PAY_LATER'
  })
  const [loading, setLoading] = useState(false)
  const [driverRate] = useState(50) // Fixed daily rate
  const confirm = useConfirm()

  useEffect(() => {
    // Get dates from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const startDate = urlParams.get('startDate')
    const endDate = urlParams.get('endDate')
    
    if (startDate && endDate) {
      setFormData(prev => ({
        ...prev,
        startTime: startDate,
        endTime: endDate
      }))
    }

    // Release lock when user leaves the page
    const handleBeforeUnload = async () => {
      try {
        const token = localStorage.getItem('token')
        await fetch('/api/bookings/release-lock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ lockId: lockData.lockId, carId: car.id }),
          keepalive: true
        })
      } catch (error) {
        console.error('Failed to release lock on page unload:', error)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      // Also release lock on component unmount
      handleBeforeUnload()
    }
  }, [lockData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onConfirm({
        ...formData,
        carId: car.id,
        lockId: lockData.lockId,
        paymentType: formData.paymentType
      })
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePrice = () => {
    if (!formData.startTime || !formData.endTime) return 0
    
    const hours = (new Date(formData.endTime) - new Date(formData.startTime)) / (1000 * 60 * 60)
    let carPrice = 0
    
    if (formData.pricingMode === 'daily') {
      carPrice = Math.ceil(hours / 24) * car.dailyRate
    } else {
      carPrice = formData.estimatedKm * car.kmRate
    }
    
    const driverPrice = formData.withDriver ? driverRate : 0
    return carPrice + driverPrice
  }

  const getDriverPrice = () => {
    return formData.withDriver ? driverRate : 0
  }

  const getDuration = () => {
    if (!formData.startTime || !formData.endTime) return ''
    const hours = (new Date(formData.endTime) - new Date(formData.startTime)) / (1000 * 60 * 60)
    const days = Math.ceil(hours / 24)
    return days === 1 ? '1 day' : `${days} days`
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header with Timer */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Booking Details</h3>
            <p className="opacity-90">Complete your reservation</p>
          </div>
          <CountdownTimer 
            expiresAt={lockData.expiresAt} 
            onExpire={() => {
              // Clear booking data and redirect to search
              localStorage.removeItem('selectedCar')
              localStorage.removeItem('lockData')
              window.location.href = '/search'
            }} 
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Date & Time Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Select Dates & Times
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pickup Date & Time</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed"
                value={formData.startTime}
                readOnly
                title="Dates are locked from your search. Go back to search to change dates."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Return Date & Time</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed"
                value={formData.endTime}
                readOnly
                title="Dates are locked from your search. Go back to search to change dates."
              />
            </div>
          </div>
          
          {getDuration() && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">Duration: {getDuration()}</p>
            </div>
          )}
        </div>

        {/* Driver Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Driver Options
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
              !formData.withDriver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="driverOption"
                checked={!formData.withDriver}
                onChange={() => setFormData({...formData, withDriver: false})}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-800">Self Drive</h5>
                  <p className="text-sm text-gray-600">Drive yourself</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">Free</p>
                  <p className="text-sm text-gray-500">no extra cost</p>
                </div>
              </div>
            </label>
            
            <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
              formData.withDriver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="driverOption"
                checked={formData.withDriver}
                onChange={() => setFormData({...formData, withDriver: true})}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-800">With Driver</h5>
                  <p className="text-sm text-gray-600">Professional driver</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">${driverRate}</p>
                  <p className="text-sm text-gray-500">fixed rate</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Pricing Mode */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Choose Pricing Plan
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
              formData.pricingMode === 'daily' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="pricingMode"
                value="daily"
                checked={formData.pricingMode === 'daily'}
                onChange={(e) => setFormData({...formData, pricingMode: e.target.value})}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-800">Daily Rate</h5>
                  <p className="text-sm text-gray-600">Best for longer trips</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">${car.dailyRate}</p>
                  <p className="text-sm text-gray-500">per day</p>
                </div>
              </div>
            </label>
            
            <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
              formData.pricingMode === 'km' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="pricingMode"
                value="km"
                checked={formData.pricingMode === 'km'}
                onChange={(e) => setFormData({...formData, pricingMode: e.target.value})}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-800">Per Kilometer</h5>
                  <p className="text-sm text-gray-600">Pay for distance</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">${car.kmRate}</p>
                  <p className="text-sm text-gray-500">per km</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* KM Estimation - Only for per-km pricing */}
        {formData.pricingMode === 'km' && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Distance (KM)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={formData.estimatedKm}
              onChange={(e) => setFormData({...formData, estimatedKm: parseInt(e.target.value) || 0})}
              placeholder="Enter estimated kilometers"
              required
            />
          </div>
        )}

        {/* Payment Options */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Payment Options
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
              formData.paymentType === 'PAY_NOW' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="paymentType"
                value="PAY_NOW"
                checked={formData.paymentType === 'PAY_NOW'}
                onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-800">Pay Now</h5>
                  <p className="text-sm text-gray-600">Secure online payment</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">Online</p>
                  <p className="text-sm text-gray-500">instant confirmation</p>
                </div>
              </div>
            </label>
            
            <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
              formData.paymentType === 'PAY_LATER' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="paymentType"
                value="PAY_LATER"
                checked={formData.paymentType === 'PAY_LATER'}
                onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-800">Pay Later</h5>
                  <p className="text-sm text-gray-600">Pay after journey ends</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">Cash</p>
                  <p className="text-sm text-gray-500">flexible payment</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicle</span>
              <span className="font-medium">{car.make} {car.model}</span>
            </div>
            {getDuration() && (
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{getDuration()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Pricing</span>
              <span className="font-medium">
                {formData.pricingMode === 'daily' ? 'Daily Rate' : `${formData.estimatedKm} KM`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Driver</span>
              <span className="font-medium">
                {formData.withDriver ? 'With Driver (Fixed Rate)' : 'Self Drive'}
              </span>
            </div>
            {formData.withDriver && (
              <div className="flex justify-between">
                <span className="text-gray-600">Driver Cost</span>
                <span className="font-medium text-orange-600">${getDriverPrice()}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total Amount</span>
                <span className="text-3xl font-bold text-green-600">${calculatePrice()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => confirm('Are you sure you want to cancel this booking?', async () => {
              // Release the car lock

              try {
                const token = localStorage.getItem('token')
                const response = await fetch('/api/bookings/release-lock', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ lockId: lockData.lockId, carId: car.id })
                })
                const result = await response.json()

              } catch (error) {
                console.error('Failed to release lock:', error)
              }
              
              // Clear all booking data to force fresh lock on next attempt
              localStorage.removeItem('selectedCar')
              localStorage.removeItem('lockData')
              
              // Navigate to search page
              window.location.href = '/search'
            })}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all"
          >
            Cancel Booking
          </button>
          
          <button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Booking...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {formData.paymentType === 'PAY_NOW' ? 'Pay Now' : 'Confirm Booking'} - ${calculatePrice()}
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}