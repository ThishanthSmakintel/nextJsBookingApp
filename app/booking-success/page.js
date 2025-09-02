'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import Breadcrumb from '@/components/Breadcrumb'

export default function BookingSuccessPage() {
  const [booking, setBooking] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const bookingData = localStorage.getItem('confirmedBooking')
    if (!bookingData) {
      router.push('/')
      return
    }
    
    try {
      const booking = JSON.parse(bookingData)
      if (!booking.id || !booking.startTime || !booking.endTime) {
        router.push('/')
        return
      }
      setBooking(booking)
    } catch (error) {
      router.push('/')
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
          <Breadcrumb items={[
            { label: 'Search Cars', href: '/search' },
            { label: 'Book Car' },
            { label: 'Booking Confirmed' }
          ]} />
          
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
                    <p><span className="text-gray-600">Pickup:</span> {format(new Date(booking.startTime), 'dd/MM/yyyy HH:mm')}</p>
                    <p><span className="text-gray-600">Return:</span> {format(new Date(booking.endTime), 'dd/MM/yyyy HH:mm')}</p>
                    <p><span className="text-gray-600">Location:</span> {booking.car.location?.name || 'Main Location'}</p>
                    <p><span className="text-gray-600">Driver:</span> {booking.withDriver ? 'With Driver' : 'Self Drive'}</p>
                    <p><span className="text-gray-600">Payment:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        booking.paymentType === 'PAY_NOW' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {booking.paymentType === 'PAY_NOW' ? 'Paid Online' : 'Pay Later'}
                      </span>
                    </p>
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

          {booking.paymentType === 'PAY_NOW' && booking.paymentStatus === 'PENDING' ? (
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => router.push(`/payment?bookingId=${booking.id}`)}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
              >
                Complete Payment - ${booking.totalPrice}
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => router.push('/')}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Return Home
                </button>
                <button 
                  onClick={() => router.push('/bookings')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  View All Bookings
                </button>
                <button 
                  onClick={() => router.push('/search')}
                  className="bg-white border-2 border-gray-500 text-gray-700 hover:bg-gray-50 font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Book Another Car
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
              >
                Return Home
              </button>
              <button 
                onClick={() => router.push('/bookings')}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
              >
                View All Bookings
              </button>
              <button 
                onClick={() => router.push('/search')}
                className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-4 px-6 rounded-xl transition-all"
              >
                Book Another Car
              </button>
            </div>
          )}
          
          <div className="text-center mt-6">
            <p className="text-gray-600">A confirmation email has been sent to your email address.</p>
          </div>
        </div>
      </div>
    </div>
  )
}