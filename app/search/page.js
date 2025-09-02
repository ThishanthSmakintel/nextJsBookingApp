'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, MapPin, Users, Car, Filter } from 'lucide-react'
import EmailAuthModal from '@/components/EmailAuthModal'
import Breadcrumb from '@/components/Breadcrumb'

export default function SearchPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showEmailAuth, setShowEmailAuth] = useState(false)
  const [selectedCarForBooking, setSelectedCarForBooking] = useState(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Validate search dates
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const now = new Date()
      now.setHours(0, 0, 0, 0) // Reset time to start of day
      
      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        router.push('/')
        return
      }
      
      // Check if start date is in the past
      if (start < now) {
        router.push('/')
        return
      }
      
      // Check if end date is before or same as start date
      if (end <= start) {
        router.push('/')
        return
      }
      
      // Check if booking duration exceeds 14 days
      const daysDiff = (end - start) / (1000 * 60 * 60 * 24)
      if (daysDiff > 14) {
        router.push('/')
        return
      }
    }
    
    const fetchCars = async () => {
      try {
        const params = new URLSearchParams(searchParams)
        const res = await fetch(`/api/cars?${params}`)
        const data = await res.json()
        setCars(Array.isArray(data) ? data : [])
      } catch (error) {
        setCars([])
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [searchParams, router])

  const handleBookCar = async (car) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setSelectedCarForBooking(car)
      setShowEmailAuth(true)
      return
    }

    proceedWithBooking(car, token)
  }

  const proceedWithBooking = async (car, token) => {
    setBookingLoading(car.id)
    try {
      const res = await fetch('/api/bookings/precheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          carId: car.id,
          startTime: searchParams.get('startDate'),
          endTime: searchParams.get('endDate')
        })
      })

      const lockData = await res.json()
      
      if (res.ok) {
        localStorage.setItem('lockData', JSON.stringify(lockData))
        localStorage.setItem('selectedCar', JSON.stringify(car))
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        
        if (!startDate || !endDate) {
          alert('Please select valid dates')
          return
        }
        
        const start = new Date(startDate)
        const end = new Date(endDate)
        
        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          alert('Invalid dates selected')
          return
        }
        
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (start < yesterday) {
          alert('Start date cannot be in the past')
          return
        }
        
        if (end <= start) {
          alert('End date must be after start date')
          return
        }
        
        const daysDiff = (end - start) / (1000 * 60 * 60 * 24)
        if (daysDiff > 14) {
          alert('Maximum booking duration is 14 days')
          return
        }
        
        router.push(`/book?startDate=${startDate}&endDate=${endDate}`)
      } else {
        alert(lockData.error)
      }
    } catch (error) {
      alert('Failed to lock car')
    } finally {
      setBookingLoading(null)
    }
  }

  const handleAuthSuccess = (token) => {
    if (selectedCarForBooking) {
      proceedWithBooking(selectedCarForBooking, token)
    }
  }

  const filteredCars = filter === 'all' ? cars : cars.filter(car => car.category === filter)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb items={[
        { label: 'Search Cars', href: '/search' }
      ]} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold flex items-center">
          <Search className="w-10 h-10 mr-3" />
          Available Cars
        </h1>
        <div className="badge badge-primary badge-lg">{filteredCars.length} cars found</div>
      </div>
      
      <div className="tabs tabs-boxed mb-6">
        <a className={`tab ${filter === 'all' ? 'tab-active' : ''}`} onClick={() => setFilter('all')}>
          <Filter className="w-4 h-4 mr-1" />
          All
        </a>
        <a className={`tab ${filter === 'economy' ? 'tab-active' : ''}`} onClick={() => setFilter('economy')}>Economy</a>
        <a className={`tab ${filter === 'luxury' ? 'tab-active' : ''}`} onClick={() => setFilter('luxury')}>Luxury</a>
        <a className={`tab ${filter === 'suv' ? 'tab-active' : ''}`} onClick={() => setFilter('suv')}>SUV</a>
      </div>
      
      {filteredCars.length === 0 ? (
        <div className="hero min-h-96">
          <div className="hero-content text-center">
            <div>
              <Car className="w-24 h-24 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-2">No cars available</h2>
              <p className="text-base-content/70">Try adjusting your search criteria</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div key={car.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <figure className="px-6 pt-6">
                <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  <Car className="w-20 h-20 text-primary" />
                </div>
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {car.make} {car.model}
                  <div className="badge badge-secondary">{car.year}</div>
                </h2>
                
                <div className="flex flex-wrap gap-2 my-2">
                  <div className="badge badge-outline">
                    <MapPin className="w-3 h-3 mr-1" />
                    {car.location?.name || 'Main Location'}
                  </div>
                  <div className="badge badge-outline">
                    <Users className="w-3 h-3 mr-1" />
                    {car.capacity} seats
                  </div>
                  <div className="badge badge-primary">{car.category}</div>
                </div>
                
                <div className="stats stats-horizontal shadow mt-4">
                  <div className="stat">
                    <div className="stat-title text-xs">Daily Rate</div>
                    <div className="stat-value text-lg text-primary">${car.dailyRate}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title text-xs">Per KM</div>
                    <div className="stat-value text-lg text-secondary">${car.kmRate}</div>
                  </div>
                </div>
                
                <div className="card-actions justify-end mt-4">
                  <button 
                    className="btn btn-primary btn-block"
                    onClick={() => handleBookCar(car)}
                    disabled={bookingLoading === car.id}
                  >
                    {bookingLoading === car.id ? (
                      <>
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                        Please wait...
                      </>
                    ) : (
                      <>
                        <Car className="w-4 h-4 mr-2" />
                        Book Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <EmailAuthModal
        isOpen={showEmailAuth}
        onClose={() => setShowEmailAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}