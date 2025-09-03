'use client'
import PermissionButton from '@/components/PermissionButton'
import { Plus, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function QuickActions() {
  const router = useRouter()
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="card-title">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <PermissionButton 
            resource="cars" 
            action="create"
            className="btn btn-primary btn-sm"
            onClick={() => router.push('/dashboard/cars')}
          >
            <Plus size={16} /> Add Car
          </PermissionButton>
          
          <PermissionButton 
            resource="drivers" 
            action="create"
            className="btn btn-secondary btn-sm"
            onClick={() => router.push('/dashboard/drivers')}
          >
            <Plus size={16} /> Add Driver
          </PermissionButton>
          
          <PermissionButton 
            resource="staff" 
            action="create"
            className="btn btn-accent btn-sm"
            onClick={() => router.push('/dashboard/staff')}
          >
            <Plus size={16} /> Add Staff
          </PermissionButton>
          
          <PermissionButton 
            resource="bookings" 
            action="create"
            className="btn btn-info btn-sm"
            onClick={() => router.push('/dashboard/create-booking')}
          >
            <Plus size={16} /> New Booking
          </PermissionButton>
          
          <PermissionButton 
            resource="customers" 
            action="create"
            className="btn btn-warning btn-sm"
            onClick={() => router.push('/dashboard/customers')}
          >
            <Plus size={16} /> Add Customer
          </PermissionButton>
          
          <PermissionButton 
            resource="reports" 
            action="read"
            className="btn btn-outline btn-sm"
            onClick={() => router.push('/dashboard/reports')}
          >
            <Download size={16} /> Reports
          </PermissionButton>
        </div>
      </div>
    </div>
  )
}