'use client'
import Link from 'next/link'
import { Plus, Download, Upload, RefreshCw } from 'lucide-react'

export default function QuickActions() {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="card-title">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/admin/cars" className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Car
          </Link>
          <Link href="/admin/drivers" className="btn btn-secondary btn-sm">
            <Plus size={16} /> Add Driver
          </Link>
          <Link href="/admin/staff" className="btn btn-accent btn-sm">
            <Plus size={16} /> Add Staff
          </Link>
          <Link href="/admin/bookings" className="btn btn-info btn-sm">
            <Plus size={16} /> New Booking
          </Link>
          <Link href="/admin/customers" className="btn btn-warning btn-sm">
            <Plus size={16} /> Add Customer
          </Link>
          <Link href="/admin/reports" className="btn btn-outline btn-sm">
            <Download size={16} /> Reports
          </Link>
        </div>
      </div>
    </div>
  )
}