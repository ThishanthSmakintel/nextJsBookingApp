'use client'
import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const currencies = {
    USD: { symbol: '$', name: 'US Dollar' },
    LKR: { symbol: 'Rs.', name: 'Sri Lankan Rupee' }
  }

  const updateBookingStatus = async (bookingId, status) => {
    console.log('Updating booking:', bookingId, status)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar size={24} /> Booking Management
        </h2>
        <select className="select select-bordered" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {Object.entries(currencies).map(([code, curr]) => (
            <option key={code} value={code}>{curr.symbol} {code}</option>
          ))}
        </select>
      </div>

      <DataTable 
        title="All Bookings"
        data={bookings.filter(b => b.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || '')}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        columns={[
          { key: 'id', label: 'ID', render: (row) => row.id?.slice(-8) },
          { key: 'customer', label: 'Customer', render: (row) => row.customer?.fullName },
          { key: 'car', label: 'Car', render: (row) => `${row.car?.make} ${row.car?.model}` },
          { key: 'startTime', label: 'Start Date', render: (row) => new Date(row.startTime).toLocaleDateString() },
          { 
            key: 'status', 
            label: 'Status', 
            render: (row) => (
              <span className={`badge ${
                row.status === 'CONFIRMED' ? 'badge-success' :
                row.status === 'PENDING' ? 'badge-warning' :
                row.status === 'CANCELLED' ? 'badge-error' : 'badge-info'
              }`}>
                {row.status}
              </span>
            )
          },
          { key: 'totalPrice', label: 'Total', render: (row) => `${currencies[currency].symbol}${row.totalPrice}` },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-sm">Actions</label>
                <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a onClick={() => updateBookingStatus(row.id, 'CONFIRMED')}>Confirm</a></li>
                  <li><a onClick={() => updateBookingStatus(row.id, 'CANCELLED')}>Cancel</a></li>
                  <li><a onClick={() => updateBookingStatus(row.id, 'COMPLETED')}>Complete</a></li>
                </ul>
              </div>
            )
          }
        ]}
      />
    </div>
  )
}