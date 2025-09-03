'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, MapPin, Users, Car, Filter, Calendar, Clock } from 'lucide-react'
import EmailAuthModal from '@/components/EmailAuthModal'
import Breadcrumb from '@/components/Breadcrumb'

export default function SearchPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(null)

  const [showEmailAuth, setShowEmailAuth] = useState(false)
  const [selectedCarForBooking, setSelectedCarForBooking] = useState(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Uncomment below to restrict search to logged-in users only
    // const token = localStorage.getItem('token')
    // if (!token) {
    //   router.push('/login')
    //   return
    // }
    
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
      const startDate = searchParams.get('startDate')
      const endDate = searchParams.get('endDate')
      
      if (!startDate || !endDate) {
        alert('Please select valid dates')
        return
      }
      
      const res = await fetch('/api/bookings/precheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          carId: car.id,
          startTime: startDate,
          endTime: endDate
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

  const filteredCars = cars

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
      
      <div className="mb-6">
        <h1 className="text-4xl font-bold flex items-center mb-6">
          <Search className="w-10 h-10 mr-3" />
          Search Cars
        </h1>
        
        {/* Search Form */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-primary" />
              Book Your Ride Now
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const params = new URLSearchParams()
              for (let [key, value] of formData.entries()) {
                if (value) params.set(key, value)
              }
              router.push(`/search?${params}`)
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </span>
                  </label>
                  <select 
                    name="location"
                    className="select select-bordered select-primary"
                    defaultValue={searchParams.get('location') || ''}
                  >
                    <option value="">All Locations</option>
                    <option value="colombo">Colombo</option>
                    <option value="kandy">Kandy</option>
                    <option value="galle">Galle</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center">
                      <Car className="w-4 h-4 mr-2" />
                      Category
                    </span>
                  </label>
                  <select 
                    name="category"
                    className="select select-bordered select-primary"
                    defaultValue={searchParams.get('category') || ''}
                  >
                    <option value="">All Categories</option>
                    <option value="economy">Economy</option>
                    <option value="luxury">Luxury</option>
                    <option value="suv">SUV</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Pickup Date & Time
                    </span>
                  </label>
                  <input 
                    type="datetime-local"
                    name="startDate"
                    className="input input-bordered input-primary"
                    defaultValue={searchParams.get('startDate') || ''}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Return Date & Time
                    </span>
                  </label>
                  <input 
                    type="datetime-local"
                    name="endDate"
                    className="input input-bordered input-primary"
                    defaultValue={searchParams.get('endDate') || ''}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button type="submit" className="btn btn-primary btn-lg gap-2">
                  <Search className="w-5 h-5" />
                  Search Available Cars
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Current Search Display */}
        {(searchParams.get('startDate') || searchParams.get('endDate')) && (
          <div className="alert alert-info mb-6">
            <Calendar className="w-5 h-5" />
            <div>
              <div className="font-semibold">Current Search:</div>
              <div className="text-sm">
                {searchParams.get('startDate') && (
                  <span>From: {new Date(searchParams.get('startDate')).toLocaleDateString('en-GB')} {new Date(searchParams.get('startDate')).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                )}
                {searchParams.get('endDate') && (
                  <span className="ml-4">To: {new Date(searchParams.get('endDate')).toLocaleDateString('en-GB')} {new Date(searchParams.get('endDate')).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                )}
              </div>
            </div>
            <div className="badge badge-primary">{filteredCars.length} cars found</div>
          </div>
        )}
      </div>
      

      
      {/* Results Section */}
      {filteredCars.length === 0 ? (
        <div className="hero min-h-96 bg-base-200 rounded-2xl">
          <div className="hero-content text-center">
            <div>
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Car className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">No cars available</h2>
              <p className="text-base-content/70 mb-6">Try adjusting your search criteria or select different dates</p>
              <div className="flex gap-2 justify-center">
                <button 
                  onClick={() => router.push('/')}
                  className="btn btn-primary"
                >
                  New Search
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Available Cars</h2>
            <div className="badge badge-primary badge-lg">{filteredCars.length} cars found</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <figure className="px-6 pt-6">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                    <Car className="w-20 h-20 text-primary" />
                  </div>
                </figure>
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="card-title text-xl">
                      {car.make} {car.model}
                    </h2>
                    <div className="badge badge-secondary font-semibold">{car.year}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="badge badge-outline gap-1">
                      <MapPin className="w-3 h-3" />
                      {car.location?.name || 'Main Location'}
                    </div>
                    <div className="badge badge-outline gap-1">
                      <Users className="w-3 h-3" />
                      {car.capacity} seats
                    </div>
                    <div className="badge badge-primary">{car.category}</div>
                  </div>
                  
                  <div className="bg-base-200 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xs text-base-content/70 mb-1">Daily Rate</p>
                        <p className="text-lg font-bold text-primary">${car.dailyRate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70 mb-1">Per KM</p>
                        <p className="text-lg font-bold text-secondary">${car.kmRate}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="btn btn-primary btn-block btn-lg gap-2 hover:scale-105 transition-transform"
                      onClick={() => handleBookCar(car)}
                      disabled={bookingLoading === car.id}
                    >
                      {bookingLoading === car.id ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Booking...
                        </>
                      ) : (
                        <>
                          <Car className="w-5 h-5" />
                          Book Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      <EmailAuthModal
        isOpen={showEmailAuth}
        onClose={() => setShowEmailAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}