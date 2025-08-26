'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BookingSuccessPage() {
  const [booking, setBooking] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const bookingData = localStorage.getItem('confirmedBooking')
    if (bookingData) {
      setBooking(JSON.parse(bookingData))
      localStorage.removeItem('confirmedBooking')
    } else {
      router.push('/dashboard')
    }
  }, [router])

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your car has been successfully booked</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Booking Details</h2>
              <p className="opacity-90">Booking ID: {booking.id}</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Vehicle Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Car:</span> {booking.car.make} {booking.car.model}</p>
                    <p><span className="text-gray-600">Year:</span> {booking.car.year}</p>
                    <p><span className="text-gray-600">Category:</span> {booking.car.category}</p>
                    <p><span className="text-gray-600">Capacity:</span> {booking.car.capacity} passengers</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Booking Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Pickup:</span> {new Date(booking.startTime).toLocaleString()}</p>
                    <p><span className="text-gray-600">Return:</span> {new Date(booking.endTime).toLocaleString()}</p>
                    <p><span className="text-gray-600">Location:</span> {booking.car.location.name}</p>
                    <p><span className="text-gray-600">Driver:</span> {booking.withDriver ? 'With Driver' : 'Self Drive'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total Amount</span>
                  <span className="text-3xl font-bold text-green-600">${booking.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              View Dashboard
            </button>
            <button 
              onClick={() => router.push('/bookings')}
              className="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-4 px-6 rounded-xl transition-all"
            >
              View All Bookings
            </button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">A confirmation email has been sent to your email address.</p>
          </div>
        </div>
      </div>
    </div>
  )
}