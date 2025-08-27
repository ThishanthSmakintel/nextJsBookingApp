'use client'
import AdminNavbar from '@/components/admin/AdminNavbar'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-base-200">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  )
}