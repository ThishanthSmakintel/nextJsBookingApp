'use client'
import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { CalendarDays, Plus, Users, Clock, Check, X, Trash2 } from 'lucide-react'
import SearchableSelect from '@/components/SearchableSelect'
import PermissionButton from '@/components/PermissionButton'
import PermissionWrapper from '@/components/PermissionWrapper'
import { useToast, useConfirm } from '@/components/Toast'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

export default function LeaveManagementPage() {
  const [leaves, setLeaves] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showApprovedModal, setShowApprovedModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeType: 'DRIVER',
    leaveType: 'VACATION',
    startDate: '',
    endDate: '',
    reason: ''
  })
  const [currentView, setCurrentView] = useState('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const toast = useToast()
  const confirm = useConfirm()

  useEffect(() => {
    fetchLeaves()
    fetchDrivers()
  }, [])

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/leaves', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setLeaves(data || [])
    } catch (error) {
      toast.error('Failed to fetch leaves')
    }
  }

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/drivers', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setDrivers(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error('Failed to fetch drivers')
      setDrivers([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (leave) => {
    setSelectedLeave(leave)
    setShowRescheduleModal(true)
  }

  const confirmApprove = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/leaves', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: selectedLeave.id, status: 'APPROVED', approvedBy: 'ADMIN' })
      })
      
      if (response.ok) {
        toast.success('Leave approved successfully')
        setShowRescheduleModal(false)
        fetchLeaves()
      } else {
        toast.error('Failed to approve leave')
      }
    } catch (error) {
      toast.error('Error approving leave')
    }
  }

  const handleReject = async (leaveId) => {
    confirm('Are you sure you want to reject this leave request?', async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/admin/leaves', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: leaveId, status: 'REJECTED', approvedBy: 'ADMIN' })
        })
        
        if (response.ok) {
          toast.success('Leave rejected successfully')
          fetchLeaves()
        } else {
          toast.error('Failed to reject leave')
        }
      } catch (error) {
        toast.error('Error rejecting leave')
      }
    })
  }

  const handleCancel = async (leaveId) => {
    confirm('Are you sure you want to cancel this leave? This action cannot be undone.', async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/admin/leaves?id=${leaveId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          toast.success('Leave cancelled successfully')
          fetchLeaves()
        } else {
          toast.error('Failed to cancel leave')
        }
      } catch (error) {
        toast.error('Error cancelling leave')
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.employeeId || !formData.startDate || !formData.endDate) {
      toast.error('Please fill all required fields')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/leaves', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, createdByAdmin: true })
      })
      
      if (response.ok) {
        toast.success('Leave request created and approved automatically')
        setShowModal(false)
        setFormData({
          employeeId: '',
          employeeType: 'DRIVER',
          leaveType: 'VACATION',
          startDate: '',
          endDate: '',
          reason: ''
        })
        fetchLeaves()
      } else {
        toast.error('Failed to create leave request')
      }
    } catch (error) {
      toast.error('Error creating leave request')
    }
  }

  const calendarEvents = Array.isArray(leaves) ? leaves.map(leave => ({
    id: leave.id,
    title: `${leave.driver?.name || 'Employee'} - ${leave.leaveType}`,
    start: new Date(leave.startDate),
    end: new Date(leave.endDate),
    resource: leave
  })) : []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarDays className="w-8 h-8" />
            Leave Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage employee leave requests and schedules</p>
        </div>
        <PermissionButton 
          resource="leaves" 
          action="create"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          Add Leave Request
        </PermissionButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-primary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Drivers</div>
          <div className="stat-value">{drivers.length}</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-warning">
            <Clock className="w-8 h-8" />
          </div>
          <div className="stat-title">Pending Leaves</div>
          <div className="stat-value">{Array.isArray(leaves) ? leaves.filter(l => l.status === 'PENDING').length : 0}</div>
        </div>
        
        <div 
          className="stat bg-base-100 shadow cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setShowApprovedModal(true)}
        >
          <div className="stat-figure text-success">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div className="stat-title">Approved Leaves</div>
          <div className="stat-value">{Array.isArray(leaves) ? leaves.filter(l => l.status === 'APPROVED' && new Date(l.endDate) >= new Date()).length : 0}</div>
          <div className="stat-desc text-success">Click to manage</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-info">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">On Leave Today</div>
          <div className="stat-value">
            {Array.isArray(leaves) ? leaves.filter(l => {
              const today = new Date()
              const start = new Date(l.startDate)
              const end = new Date(l.endDate)
              return l.status === 'APPROVED' && today >= start && today <= end
            }).length : 0}
          </div>
        </div>
      </div>

      {Array.isArray(leaves) && leaves.filter(l => l.status === 'PENDING' && new Date(l.endDate) >= new Date()).length > 0 && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Pending Approvals</h2>
            <div className="space-y-3">
              {leaves.filter(l => l.status === 'PENDING' && new Date(l.endDate) >= new Date()).map(leave => (
                <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{leave.driver?.name || 'Employee'}</div>
                    <div className="text-sm text-base-content/70">
                      {leave.leaveType} • {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                    {leave.reason && <div className="text-sm text-base-content/60">{leave.reason}</div>}
                  </div>
                  <div className="flex gap-2">
                    <PermissionButton 
                      resource="leaves" 
                      action="update"
                      className="btn btn-sm btn-success"
                      onClick={() => handleApprove(leave)}
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </PermissionButton>
                    <PermissionButton 
                      resource="leaves" 
                      action="update"
                      className="btn btn-sm btn-error"
                      onClick={() => handleReject(leave.id)}
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </PermissionButton>
                    <PermissionButton 
                      resource="leaves" 
                      action="delete"
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleCancel(leave.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel
                    </PermissionButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Leave Calendar</h2>
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2">
              <button 
                className={`btn btn-sm ${currentView === 'month' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setCurrentView('month')}
              >
                Month
              </button>
              <button 
                className={`btn btn-sm ${currentView === 'week' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setCurrentView('week')}
              >
                Week
              </button>
              <button 
                className={`btn btn-sm ${currentView === 'day' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setCurrentView('day')}
              >
                Day
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => setCurrentDate(moment(currentDate).subtract(1, currentView).toDate())}
              >
                ←
              </button>
              <span className="font-semibold">
                {moment(currentDate).format(currentView === 'month' ? 'MMMM YYYY' : 'MMM DD, YYYY')}
              </span>
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => setCurrentDate(moment(currentDate).add(1, currentView).toDate())}
              >
                →
              </button>
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </button>
            </div>
          </div>
          <div style={{ height: '450px' }}>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={currentView}
              date={currentDate}
              onView={setCurrentView}
              onNavigate={setCurrentDate}
              selectable
              onSelectSlot={(slotInfo) => {
                setFormData({
                  ...formData,
                  startDate: moment(slotInfo.start).format('YYYY-MM-DD'),
                  endDate: moment(slotInfo.end).format('YYYY-MM-DD')
                })
                setShowModal(true)
              }}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: event.resource.status === 'APPROVED' ? '#10b981' : 
                                 event.resource.status === 'PENDING' ? '#f59e0b' : '#ef4444'
                }
              })}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <PermissionWrapper resource="leaves" action="create">
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Add Leave Request</h3>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Driver *</span></label>
                  <SearchableSelect
                    options={Array.isArray(drivers) ? drivers.map(d => ({ value: d.id, label: d.name })) : []}
                    value={formData.employeeId}
                    onChange={(value) => setFormData({...formData, employeeId: value})}
                    placeholder={loading ? "Loading drivers..." : "Select driver"}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label"><span className="label-text">Leave Type *</span></label>
                  <SearchableSelect
                    options={[
                      { value: 'VACATION', label: 'Vacation' },
                      { value: 'SICK', label: 'Sick Leave' },
                      { value: 'PERSONAL', label: 'Personal' },
                      { value: 'EMERGENCY', label: 'Emergency' }
                    ]}
                    value={formData.leaveType}
                    onChange={(value) => setFormData({...formData, leaveType: value})}
                    placeholder="Select leave type"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Start Date *</span></label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">End Date *</span></label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label"><span className="label-text">Reason</span></label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Optional reason for leave"
                  />
                </div>
                
                <div className="modal-action">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Leave Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </PermissionWrapper>
      )}
    </div>
  )
}