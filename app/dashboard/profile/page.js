'use client'
import { useState, useEffect } from 'react'
import { User, Phone, Mail, Car } from 'lucide-react'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setProfile(user)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-16">
                <User className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile?.name || profile?.fullName}</h2>
              <p className="text-gray-600">{profile?.role}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{profile?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{profile?.phone || 'Not provided'}</p>
              </div>
            </div>
            
            {profile?.role === 'DRIVER' && (
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">License Number</p>
                  <p>{profile?.licenseNumber || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}