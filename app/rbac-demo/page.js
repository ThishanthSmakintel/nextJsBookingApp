'use client'
import { RealTimePermissionProvider } from '@/contexts/RealTimePermissionContext'
import { PermissionButton, PermissionForm, PermissionSection } from '@/components/DynamicPermissionUI'
import RealTimePermissionManager from '@/components/admin/RealTimePermissionManager'
import { useAuth } from '@/contexts/AuthContext'

function DemoContent() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Real-Time RBAC Demo</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current User</h2>
        <p>Name: {user?.name}</p>
        <p>Role: {user?.role}</p>
        <p className="text-sm text-gray-600 mt-2">
          Permissions will update instantly when changed by admin
        </p>
      </div>

      {/* Dynamic Buttons */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dynamic Buttons</h2>
        <div className="space-x-4">
          <PermissionButton 
            action="create" 
            subject="Booking"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Booking
          </PermissionButton>
          
          <PermissionButton 
            action="update" 
            subject="Car"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Car
          </PermissionButton>
          
          <PermissionButton 
            action="delete" 
            subject="Customer"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Customer
          </PermissionButton>
        </div>
      </div>

      {/* Dynamic Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dynamic Form</h2>
        <PermissionForm action="update" subject="Booking" className="relative">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Booking ID" 
              className="p-2 border rounded"
            />
            <input 
              type="date" 
              className="p-2 border rounded"
            />
            <select className="p-2 border rounded">
              <option>Select Status</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
            </select>
            <button className="bg-blue-600 text-white p-2 rounded">
              Update Booking
            </button>
          </div>
        </PermissionForm>
      </div>

      {/* Conditional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PermissionSection 
          action="read" 
          subject="Report"
          fallback={
            <div className="bg-red-50 p-4 rounded-lg text-red-800">
              Access Denied: Cannot view reports
            </div>
          }
        >
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Reports Section</h3>
            <p>This section is only visible if you have report permissions.</p>
          </div>
        </PermissionSection>

        <PermissionSection 
          action="manage" 
          subject="Permission"
          fallback={
            <div className="bg-red-50 p-4 rounded-lg text-red-800">
              Access Denied: Admin only
            </div>
          }
        >
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Admin Panel</h3>
            <p>This section is only visible to admins.</p>
          </div>
        </PermissionSection>
      </div>

      {/* Admin Permission Manager */}
      {user?.role === 'ADMIN' && (
        <RealTimePermissionManager />
      )}
    </div>
  )
}

export default function RBACDemoPage() {
  return (
    <RealTimePermissionProvider>
      <DemoContent />
    </RealTimePermissionProvider>
  )
}