'use client'
import { useState, useEffect } from 'react'
import { UserCheck, CheckCircle, XCircle, Settings } from 'lucide-react'

export default function RBACPage() {
  const [customers, setCustomers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [staff, setStaff] = useState([])

  const updateStaffPermissions = async (userId, updates) => {
    // API call to update permissions
    console.log('Updating permissions for user:', userId, updates)
  }

  const showToast = (message) => {
    console.log('Toast:', message)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <UserCheck size={24} /> Role-Based Access Control
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title text-success">Admin Role</h3>
            <div className="space-y-2">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Manage All</span>
                  <input type="checkbox" className="toggle toggle-success" defaultChecked disabled />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">View Dashboard</span>
                  <input type="checkbox" className="toggle toggle-success" defaultChecked disabled />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Manage Users</span>
                  <input type="checkbox" className="toggle toggle-success" defaultChecked disabled />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title text-warning">Driver Role</h3>
            <div className="space-y-2">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">View Own Bookings</span>
                  <input type="checkbox" className="toggle toggle-warning" defaultChecked />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Update Booking Status</span>
                  <input type="checkbox" className="toggle toggle-warning" defaultChecked />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title text-info">Customer Role</h3>
            <div className="space-y-2">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Create Bookings</span>
                  <input type="checkbox" className="toggle toggle-info" defaultChecked />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">View Own Bookings</span>
                  <input type="checkbox" className="toggle toggle-info" defaultChecked />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Permission Matrix</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Admin</th>
                  <th>Driver</th>
                  <th>Customer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bookings (Create)</td>
                  <td><CheckCircle className="text-success" size={16} /></td>
                  <td><XCircle className="text-error" size={16} /></td>
                  <td><CheckCircle className="text-success" size={16} /></td>
                </tr>
                <tr>
                  <td>Bookings (Read Own)</td>
                  <td><CheckCircle className="text-success" size={16} /></td>
                  <td><CheckCircle className="text-success" size={16} /></td>
                  <td><CheckCircle className="text-success" size={16} /></td>
                </tr>
                <tr>
                  <td>Cars (Manage)</td>
                  <td><CheckCircle className="text-success" size={16} /></td>
                  <td><XCircle className="text-error" size={16} /></td>
                  <td><XCircle className="text-error" size={16} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={() => showToast('RBAC settings saved successfully!')}>
          <Settings size={16} /> Save RBAC Settings
        </button>
      </div>
    </div>
  )
}