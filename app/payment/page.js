'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import Breadcrumb from '@/components/Breadcrumb'

export default function PaymentPage() {
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  useEffect(() => {
    // Validate booking data exists
    const bookingData = localStorage.getItem('confirmedBooking')
    if (!bookingData) {
      router.push('/')
      return
    }
    
    try {
      const booking = JSON.parse(bookingData)
      // Validate booking has required fields
      if (!booking.id || !booking.startTime || !booking.endTime) {
        router.push('/')
        return
      }
      setBooking(booking)
    } catch (error) {
      router.push('/')
    }
  }, [router])

  const handlePayment = async () => {
    setLoading(true)
    
    // Simulate payment processing
    setTimeout(() => {
      // Update booking payment status
      const updatedBooking = { ...booking, paymentStatus: 'PAID' }
      localStorage.setItem('confirmedBooking', JSON.stringify(updatedBooking))
      
      setLoading(false)
      router.push('/booking-success')
    }, 2000)
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Breadcrumb items={[
            { label: 'Search Cars', href: '/search' },
            { label: 'Book Car', href: '/book' },
            { label: 'Payment' }
          ]} />
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Complete Payment</h1>
            <p className="text-gray-600">Secure payment for your booking</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
              <p className="opacity-90">Booking ID: {booking.id}</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Car:</span>
                    <span className="font-medium">{booking.car.make} {booking.car.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {format(new Date(booking.startTime), 'dd/MM/yyyy')} - {format(new Date(booking.endTime), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total Amount</span>
                  <span className="text-3xl font-bold text-green-600">${booking.totalPrice}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => router.back()}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              Back
            </button>
            <button 
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Pay $${booking.totalPrice}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}