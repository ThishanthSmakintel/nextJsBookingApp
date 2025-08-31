'use client'
import { useState, useEffect } from 'react'
import { Wrench, Plus, Car, Calendar } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import SearchableSelect from '@/components/SearchableSelect'
import { useToast } from '@/components/Toast'

export default function MaintenancePage() {
  const [maintenances, setMaintenances] = useState([])
  const [cars, setCars] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    carId: '',
    type: 'ROUTINE',
    description: '',
    startDate: '',
    endDate: '',
    cost: ''
  })
  const toast = useToast()

  useEffect(() => {
    fetchMaintenances()
    fetchCars()
  }, [])

  const fetchMaintenances = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/maintenances', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setMaintenances(data || [])
    } catch (error) {
      toast.error('Failed to fetch maintenances')
    }
  }

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/cars', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setCars(data || [])
    } catch (error) {
      toast.error('Failed to fetch cars')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.carId || !formData.description || !formData.startDate) {
      toast.error('Please fill all required fields')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/maintenances', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        toast.success('Maintenance scheduled successfully')
        setShowModal(false)
        setFormData({
          carId: '',
          type: 'ROUTINE',
          description: '',
          startDate: '',
          endDate: '',
          cost: ''
        })
        fetchMaintenances()
      } else {
        toast.error('Failed to schedule maintenance')
      }
    } catch (error) {
      toast.error('Error scheduling maintenance')
    }
  }

  const columns = [
    { key: 'carId', label: 'Car', render: (value, maintenance) => 
      maintenance.car ? `${maintenance.car.make} ${maintenance.car.model}` : 'Unknown Car' 
    },
    { key: 'type', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'startDate', label: 'Start Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'endDate', label: 'End Date', render: (value) => value ? new Date(value).toLocaleDateString() : 'Ongoing' },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`badge ${
        value === 'COMPLETED' ? 'badge-success' :
        value === 'IN_PROGRESS' ? 'badge-warning' : 'badge-info'
      }`}>
        {value}
      </span>
    )},
    { key: 'cost', label: 'Cost', render: (value) => value ? `$${value}` : 'TBD' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="w-8 h-8" />
            Maintenance Management
          </h1>
          <p className="text-base-content/70 mt-1">Schedule and track vehicle maintenance</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Schedule Maintenance
        </button>
      </div>

      <DataTable
        data={maintenances}
        columns={columns}
        searchPlaceholder="Search maintenance records..."
      />

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Schedule Maintenance</h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Car *</span></label>
                <SearchableSelect
                  options={cars.map(c => ({ value: c.id, label: `${c.make} ${c.model} (${c.licensePlate})` }))}
                  value={formData.carId}
                  onChange={(value) => setFormData({...formData, carId: value})}
                  placeholder="Select car"
                />
              </div>
              
              <div className="form-control">
                <label className="label"><span className="label-text">Type *</span></label>
                <SearchableSelect
                  options={[
                    { value: 'ROUTINE', label: 'Routine Maintenance' },
                    { value: 'REPAIR', label: 'Repair' },
                    { value: 'INSPECTION', label: 'Inspection' }
                  ]}
                  value={formData.type}
                  onChange={(value) => setFormData({...formData, type: value})}
                  placeholder="Select type"
                />
              </div>
              
              <div className="form-control">
                <label className="label"><span className="label-text">Description *</span></label>
                <textarea
                  className="textarea textarea-bordered"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the maintenance work"
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
                  <label className="label"><span className="label-text">End Date</span></label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label"><span className="label-text">Estimated Cost</span></label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Schedule Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}