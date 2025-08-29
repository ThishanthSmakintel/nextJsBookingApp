'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import CanAccess from '@/components/CanAccess';
import { UserCheck, UserPlus, Edit, Trash2, Calendar } from 'lucide-react';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    active: true
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/drivers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/drivers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDriver)
      });
      
      if (response.ok) {
        setShowAddModal(false);
        setNewDriver({ name: '', phone: '', licenseNumber: '', active: true });
        fetchDrivers();
      }
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'licenseNumber', label: 'License Number' },
    { key: 'active', label: 'Status', render: (value) => (
      <span className={`badge ${value ? 'badge-success' : 'badge-error'}`}>
        {value ? 'Active' : 'Inactive'}
      </span>
    )},
    {
      key: 'actions',
      label: 'Actions',
      render: (_, driver) => (
        <div className="flex gap-2">
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => window.open(`/admin/drivers/schedule?driverId=${driver.id}`, '_blank')}
          >
            Schedule
          </button>
          <CanAccess action="update" subject="Driver" fallback={null}>
            <button className="btn btn-sm btn-ghost">
              <Edit className="w-4 h-4" />
            </button>
          </CanAccess>
          <CanAccess action="delete" subject="Driver" fallback={null}>
            <button className="btn btn-sm btn-ghost text-error">
              <Trash2 className="w-4 h-4" />
            </button>
          </CanAccess>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <CanAccess action="read" subject="Driver">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UserCheck className="w-8 h-8" />
              Drivers Management
            </h1>
            <p className="text-base-content/70 mt-1">Manage driver accounts and assignments</p>
          </div>
          <CanAccess action="create" subject="Driver" fallback={null}>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <UserPlus className="w-4 h-4" />
              Add Driver
            </button>
          </CanAccess>
        </div>

      <DataTable
        data={drivers}
        columns={columns}
        searchPlaceholder="Search drivers..."
      />

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add New Driver</h3>
            <form onSubmit={handleAddDriver} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">License Number</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newDriver.licenseNumber}
                  onChange={(e) => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                  required
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </CanAccess>
  );
}