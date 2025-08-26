'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Car, Calendar, Search, Zap, UserCheck, Smartphone, Shield, Clock, Star, Users, Award, CheckCircle } from 'lucide-react'

export default function HomePage() {
  const [searchData, setSearchData] = useState({
    location: '',
    startDate: '',
    endDate: '',
    category: ''
  })
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchData)
    router.push(`/search?${params}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary to-secondary">
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-6xl font-bold mb-4">CarBook</h1>
              <p className="text-2xl mb-2">Premium Event-Driven Car Booking Platform</p>
              <p className="text-lg opacity-90">Experience seamless car rentals with real-time booking, professional drivers, and instant confirmations across Sri Lanka & India</p>
            </div>
            
            <div className="card bg-base-100 shadow-2xl max-w-2xl mx-auto">
              <div className="card-body">
                <h2 className="card-title text-2xl text-base-content justify-center mb-6">Book Your Ride Now</h2>
                
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Location
                        </span>
                      </label>
                      <select 
                        className="select select-bordered select-primary"
                        value={searchData.location}
                        onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                        required
                      >
                        <option value="">Select Location</option>
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
                        className="select select-bordered select-primary"
                        value={searchData.category}
                        onChange={(e) => setSearchData({...searchData, category: e.target.value})}
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
                          Start Date
                        </span>
                      </label>
                      <input 
                        type="datetime-local"
                        className="input input-bordered input-primary"
                        value={searchData.startDate}
                        onChange={(e) => setSearchData({...searchData, startDate: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          End Date
                        </span>
                      </label>
                      <input 
                        type="datetime-local"
                        className="input input-bordered input-primary"
                        value={searchData.endDate}
                        onChange={(e) => setSearchData({...searchData, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-full mt-6">
                    <Search className="w-5 h-5 mr-2" />
                    Search Available Cars
                  </button>
                </form>
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