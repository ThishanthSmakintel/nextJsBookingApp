'use client'
import { useState, useEffect } from 'react'
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import SearchableSelect from '@/components/SearchableSelect'
import PermissionButton from '@/components/PermissionButton'
import PermissionWrapper from '@/components/PermissionWrapper'
import { useToast, useConfirm } from '@/components/Toast'
import { useCurrency } from '@/contexts/CurrencyContext'
import { currencies, formatCurrency } from '@/lib/currency'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [formData, setFormData] = useState({ customerId: '', carId: '', startTime: '', endTime: '', status: 'PENDING' })
  const [deleting, setDeleting] = useState(null)
  const toast = useToast()
  const confirm = useConfirm()
  const { currency } = useCurrency()

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



  const updateBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      if (response.ok) fetchBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const handleEditBooking = (booking) => {
    setEditingBooking(booking)
    setFormData({
      customerId: booking.customerId,
      carId: booking.carId,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status
    })
    setShowModal(true)
  }

  const handleDeleteBooking = async (bookingId) => {
    confirm('Delete this booking?', async () => {
      setDeleting(bookingId)
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/admin/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          toast.success('Booking deleted successfully')
          fetchBookings()
        } else {
          toast.error('Failed to delete booking')
        }
      } catch (error) {
        toast.error('Error deleting booking')
      } finally {
        setDeleting(null)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            Booking Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage all bookings and reservations</p>
        </div>
        <PermissionButton 
          resource="bookings" 
          action="create"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          Add Booking
        </PermissionButton>
      </div>

      <DataTable
        data={bookings}
        columns={[
          { key: 'id', label: 'ID', render: (value) => value?.slice(-8) || 'N/A' },
          { key: 'customerId', label: 'Customer', render: (value, booking) => booking.customer?.name || booking.customer?.email || 'Unknown Customer' },
          { key: 'carId', label: 'Car', render: (value, booking) => booking.car ? `${booking.car.make} ${booking.car.model}` : 'Unknown Car' },
          { key: 'startTime', label: 'Start Date', render: (value) => new Date(value).toLocaleDateString() },
          { 
            key: 'status', 
            label: 'Status', 
            render: (value) => (
              <span className={`badge ${
                value === 'CONFIRMED' ? 'badge-success' :
                value === 'PENDING' ? 'badge-warning' :
                value === 'CANCELLED' ? 'badge-error' : 'badge-info'
              }`}>
                {value}
              </span>
            )
          },
          { key: 'totalPrice', label: 'Total', render: (value) => formatCurrency(value, currency) },
          {
            key: 'actions',
            label: 'Actions',
            render: (_, booking) => (
              <div className="flex gap-2">
                <SearchableSelect
                  options={[
                    { value: 'CONFIRMED', label: 'Confirm' },
                    { value: 'CANCELLED', label: 'Cancel' },
                    { value: 'COMPLETED', label: 'Complete' }
                  ]}
                  value={booking.status}
                  onChange={(status) => updateBookingStatus(booking.id, status)}
                  placeholder="Status"
                  className="w-24"
                />
                <PermissionButton 
                  resource="bookings" 
                  action="update"
                  className="btn btn-sm btn-ghost"
                  onClick={() => handleEditBooking(booking)}
                >
                  <Edit className="w-4 h-4" />
                </PermissionButton>
                <PermissionButton 
                  resource="bookings" 
                  action="delete"
                  className="btn btn-sm btn-ghost text-error"
                  onClick={() => handleDeleteBooking(booking.id)}
                  disabled={deleting === booking.id}
                >
                  {deleting === booking.id ? (
                    <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </PermissionButton>
              </div>
            )
          }
        ]}
        searchPlaceholder="Search bookings..."
      />

      {showModal && (
        <PermissionWrapper resource="bookings" action={editingBooking ? 'update' : 'create'}>
          <div className="modal modal-open">
            <div className="modal-box">
            <h3 className="font-bold text-lg">{editingBooking ? 'Edit Booking' : 'Add Booking'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault()
              try {
                const token = localStorage.getItem('token')
                const url = editingBooking ? `/api/admin/bookings/${editingBooking.id}` : '/api/admin/bookings'
                const response = await fetch(url, {
                  method: editingBooking ? 'PUT' : 'POST',
                  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
                })
                if (response.ok) {
                  setShowModal(false)
                  setEditingBooking(null)
                  setFormData({ customerId: '', carId: '', startTime: '', endTime: '', status: 'PENDING' })
                  fetchBookings()
                }
              } catch (error) {
                console.error('Error saving booking:', error)
              }
            }} className="space-y-4 mt-4">
              <input type="text" placeholder="Customer ID" className="input input-bordered w-full" value={formData.customerId} onChange={(e) => setFormData({...formData, customerId: e.target.value})} required />
              <input type="text" placeholder="Car ID" className="input input-bordered w-full" value={formData.carId} onChange={(e) => setFormData({...formData, carId: e.target.value})} required />
              <input type="datetime-local" className="input input-bordered w-full" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} required />
              <input type="datetime-local" className="input input-bordered w-full" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} required />
              <SearchableSelect
                options={[
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'CONFIRMED', label: 'Confirmed' },
                  { value: 'CANCELLED', label: 'Cancelled' },
                  { value: 'COMPLETED', label: 'Completed' }
                ]}
                value={formData.status}
                onChange={(value) => setFormData({...formData, status: value})}
                placeholder="Select status"
              />
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingBooking ? 'Update' : 'Add'} Booking</button>
              </div>
            </form>
            </div>
          </div>
        </PermissionWrapper>
      )}
    </div>
  )
}