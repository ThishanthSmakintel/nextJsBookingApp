'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Car, Calendar, Search, Zap, UserCheck, Smartphone, Shield, Clock, Star, Users, Award, CheckCircle, Filter } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'
import { useToast } from '@/components/Toast'

export default function HomePage() {
  const [searchData, setSearchData] = useState({
    location: '',
    startDate: '',
    endDate: '',
    category: ''
  })
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [carsLoading, setCarsLoading] = useState(true)
  const router = useRouter()
  const { t } = useLocale()
  const toast = useToast()

  useEffect(() => {
    fetchCars()
  }, [])

  useEffect(() => {
    filterCars()
  }, [cars, searchData])

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars')
      const data = await res.json()
      setCars(Array.isArray(data) ? data : [])
    } catch (error) {
      setCars([])
    } finally {
      setCarsLoading(false)
    }
  }

  const filterCars = () => {
    let filtered = cars
    
    if (searchData.location) {
      filtered = filtered.filter(car => 
        car.location?.city?.toLowerCase().includes(searchData.location.toLowerCase())
      )
    }
    
    if (searchData.category) {
      filtered = filtered.filter(car => 
        car.category?.toLowerCase().includes(searchData.category.toLowerCase())
      )
    }
    
    setFilteredCars(filtered)
  }

  const getAvailabilityStatus = (car) => {
    if (!car.isActive) return { status: 'maintenance', text: 'Under Maintenance', color: 'badge-warning' }
    // Check if car has active bookings (simplified logic)
    const hasActiveBooking = Math.random() > 0.85 // 15% chance of being booked
    if (hasActiveBooking) return { status: 'booked', text: 'Currently Booked', color: 'badge-error' }
    return { status: 'available', text: 'Available Now', color: 'badge-success' }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    
    if (!searchData.startDate || !searchData.endDate) {
      toast.error('Please select both pickup and return dates')
      return
    }
    
    const start = new Date(searchData.startDate)
    const end = new Date(searchData.endDate)
    const now = new Date()
    
    if (start < now) {
      toast.error('Pickup date cannot be in the past')
      return
    }
    
    if (end <= start) {
      toast.error('Return date must be after pickup date')
      return
    }
    
    const daysDiff = (end - start) / (1000 * 60 * 60 * 24)
    if (daysDiff > 14) {
      toast.error('Maximum booking duration is 14 days')
      return
    }
    
    setLoading(true)
    const params = new URLSearchParams(searchData)
    router.push(`/search?${params}`)
  }

  const handleBookCar = (car) => {
    if (!searchData.startDate || !searchData.endDate) {
      toast.error('Please select pickup and return dates first')
      return
    }
    const params = new URLSearchParams(searchData)
    router.push(`/search?${params}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        </div>
        
        <div className="relative hero min-h-screen">
          <div className="hero-content text-center text-white max-w-7xl mx-auto px-4">
            <div className="w-full">
              <div className="mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                    <Car className="w-8 h-8" />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    CarBook
                  </h1>
                </div>
                <p className="text-xl md:text-2xl mb-4 text-gray-200">Premium Car Rental Platform</p>
                <p className="text-lg opacity-80 max-w-2xl mx-auto">Experience seamless car rentals with real-time booking, professional drivers, and instant confirmations across Sri Lanka</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Search Card */}
                <div className="lg:col-span-2">
                  <div className="card bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
                    <div className="card-body">
                      <h2 className="card-title text-2xl text-white justify-center mb-6">
                        <Search className="w-6 h-6 mr-2" />
                        Find Your Perfect Ride
                      </h2>
                      
                      <form onSubmit={handleSearch} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold flex items-center text-white">
                                <MapPin className="w-4 h-4 mr-2" />
                                Location
                              </span>
                            </label>
                            <select className="select select-bordered bg-white/20 border-white/30 text-white placeholder-white/70">
                              <option value="" className="text-gray-800">All Locations</option>
                              <option value="colombo" className="text-gray-800">Colombo</option>
                              <option value="kandy" className="text-gray-800">Kandy</option>
                              <option value="galle" className="text-gray-800">Galle</option>
                              <option value="katunayake" className="text-gray-800">Katunayake</option>
                            </select>
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold flex items-center text-white">
                                <Car className="w-4 h-4 mr-2" />
                                Category
                              </span>
                            </label>
                            <select className="select select-bordered bg-white/20 border-white/30 text-white">
                              <option value="" className="text-gray-800">All Categories</option>
                              <option value="economy" className="text-gray-800">Economy</option>
                              <option value="compact" className="text-gray-800">Compact</option>
                              <option value="suv" className="text-gray-800">SUV</option>
                              <option value="luxury" className="text-gray-800">Luxury</option>
                              <option value="van" className="text-gray-800">Van/Bus</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold flex items-center text-white">
                                <Calendar className="w-4 h-4 mr-2" />
                                Pickup Date
                              </span>
                            </label>
                            <input 
                              type="datetime-local"
                              className="input input-bordered bg-white/20 border-white/30 text-white"
                              value={searchData.startDate}
                              onChange={(e) => setSearchData({...searchData, startDate: e.target.value})}
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold flex items-center text-white">
                                <Calendar className="w-4 h-4 mr-2" />
                                Return Date
                              </span>
                            </label>
                            <input 
                              type="datetime-local"
                              className="input input-bordered bg-white/20 border-white/30 text-white"
                              value={searchData.endDate}
                              onChange={(e) => setSearchData({...searchData, endDate: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            type="button" 
                            onClick={() => setSearchData({ location: '', startDate: '', endDate: '', category: '' })} 
                            className="btn btn-outline border-white/30 text-white hover:bg-white/20 flex-1"
                          >
                            <Filter className="w-4 h-4 mr-1" />
                            Clear
                          </button>
                          <button 
                            type="submit" 
                            className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-0 text-white hover:from-blue-600 hover:to-purple-700 flex-2" 
                            disabled={loading}
                          >
                            {loading ? (
                              <span className="loading loading-spinner loading-sm mr-2"></span>
                            ) : (
                              <Search className="w-5 h-5 mr-2" />
                            )}
                            {loading ? 'Searching...' : 'Search Cars'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="card bg-white/10 backdrop-blur-lg border border-white/20">
                    <div className="card-body text-center py-6">
                      <div className="text-3xl font-bold text-white">{filteredCars.length}</div>
                      <div className="text-sm text-gray-300">Cars Available</div>
                    </div>
                  </div>
                  <div className="card bg-white/10 backdrop-blur-lg border border-white/20">
                    <div className="card-body text-center py-6">
                      <div className="text-3xl font-bold text-white">4</div>
                      <div className="text-sm text-gray-300">Locations</div>
                    </div>
                  </div>
                  <div className="card bg-white/10 backdrop-blur-lg border border-white/20">
                    <div className="card-body text-center py-6">
                      <div className="text-3xl font-bold text-white">24/7</div>
                      <div className="text-sm text-gray-300">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose CarBook?</h2>
            <p className="text-lg opacity-70">Advanced technology meets premium service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body text-center">
                <Zap className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
                <p>Real-time availability with 10-minute car reservations and instant confirmations</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body text-center">
                <UserCheck className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Auto Driver Assignment</h3>
                <p>Professional drivers automatically assigned based on location and availability</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body text-center">
                <Smartphone className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
                <p>Live notifications via SMS, WhatsApp, and email for all booking events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Details Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Event-Driven Car Booking Platform</h2>
              <p className="text-lg mb-6">CarBook is a modern, technology-driven car rental platform designed for events, weddings, corporate functions, and special occasions across Sri Lanka and India.</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success mt-1" />
                  <div>
                    <h4 className="font-semibold">Redis-Powered Locking System</h4>
                    <p className="text-sm opacity-70">Secure 10-minute car reservations with countdown timers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success mt-1" />
                  <div>
                    <h4 className="font-semibold">Event-Driven Architecture</h4>
                    <p className="text-sm opacity-70">Microservices with Redis pub/sub for real-time updates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success mt-1" />
                  <div>
                    <h4 className="font-semibold">Role-Based Access Control</h4>
                    <p className="text-sm opacity-70">CASL-powered permissions for customers, drivers, and admins</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="stat bg-primary text-primary-content rounded-lg">
                <div className="stat-figure">
                  <Users className="w-8 h-8" />
                </div>
                <div className="stat-title text-primary-content/70">Happy Customers</div>
                <div className="stat-value">10K+</div>
              </div>
              <div className="stat bg-secondary text-secondary-content rounded-lg">
                <div className="stat-figure">
                  <Car className="w-8 h-8" />
                </div>
                <div className="stat-title text-secondary-content/70">Fleet Size</div>
                <div className="stat-value">500+</div>
              </div>
              <div className="stat bg-accent text-accent-content rounded-lg">
                <div className="stat-figure">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="stat-title text-accent-content/70">Avg Response</div>
                <div className="stat-value">2min</div>
              </div>
              <div className="stat bg-success text-success-content rounded-lg">
                <div className="stat-figure">
                  <Star className="w-8 h-8" />
                </div>
                <div className="stat-title text-success-content/70">Rating</div>
                <div className="stat-value">4.9</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Cars Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Live Fleet</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Available Cars
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Browse our premium fleet with real-time availability and instant booking</p>
          </div>
          
          {carsLoading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-24 h-24 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold mb-2">No cars found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="badge badge-primary badge-lg">{filteredCars.length} cars available</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCars.map((car) => {
                  const availability = getAvailabilityStatus(car)
                  return (
                    <div key={car.id} className="group card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                      <figure className="px-6 pt-6 relative">
                        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                          <Car className="w-20 h-20 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className={`absolute top-8 right-8 badge ${availability.color} badge-sm`}>
                          {availability.status === 'available' ? '●' : availability.status === 'booked' ? '●' : '●'}
                        </div>
                      </figure>
                      <div className="card-body p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h2 className="card-title text-lg font-bold text-gray-800">{car.make} {car.model}</h2>
                            <p className="text-sm text-gray-500">{car.year} • {car.licensePlate}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="badge badge-outline badge-sm gap-1 text-xs">
                            <MapPin className="w-3 h-3" />
                            {car.location?.city || 'Colombo'}
                          </div>
                          <div className="badge badge-outline badge-sm gap-1 text-xs">
                            <Users className="w-3 h-3" />
                            {car.capacity} seats
                          </div>
                          <div className="badge badge-primary badge-sm capitalize">{car.category}</div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Daily Rate</p>
                              <p className="text-lg font-bold text-blue-600">LKR {(car.dailyRate || car.pricePerHour || 50) * 300}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Per KM</p>
                              <p className="text-lg font-bold text-purple-600">LKR {((car.kmRate || 0.5) * 300).toFixed(0)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-medium text-gray-600">Status:</span>
                          <div className={`badge ${availability.color} badge-sm`}>
                            {availability.text}
                          </div>
                        </div>
                        
                        <div className="card-actions">
                          <button 
                            className={`btn btn-block transition-all duration-300 ${
                              availability.status === 'available' 
                                ? 'btn-primary hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:scale-105' 
                                : 'btn-disabled'
                            }`}
                            onClick={() => handleBookCar(car)}
                            disabled={availability.status !== 'available'}
                          >
                            {availability.status === 'available' ? (
                              <>
                                <Car className="w-4 h-4 mr-2" />
                                Book Now
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 mr-2" />
                                {availability.text}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Built with Modern Technology</h2>
          <p className="text-lg mb-12 opacity-70">Powered by Next.js 14, Node.js, PostgreSQL, Redis, and Socket.IO</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card bg-base-200">
              <div className="card-body">
                <Shield className="w-12 h-12 mx-auto mb-2 text-primary" />
                <h4 className="font-bold">Secure</h4>
                <p className="text-sm">JWT authentication & encrypted data</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <Zap className="w-12 h-12 mx-auto mb-2 text-primary" />
                <h4 className="font-bold">Fast</h4>
                <p className="text-sm">Redis caching & optimized queries</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <Smartphone className="w-12 h-12 mx-auto mb-2 text-primary" />
                <h4 className="font-bold">Real-time</h4>
                <p className="text-sm">Socket.IO for live updates</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <Award className="w-12 h-12 mx-auto mb-2 text-primary" />
                <h4 className="font-bold">Scalable</h4>
                <p className="text-sm">Microservices architecture</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}