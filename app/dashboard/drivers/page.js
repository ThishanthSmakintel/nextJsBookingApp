'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import CanAccess from '@/components/CanAccess';
import { useToast, useConfirm } from '@/components/Toast';
import { UserCheck, UserPlus, Edit, Trash2, Calendar } from 'lucide-react';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    active: true
  });
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();
  const confirm = useConfirm();

  const handleEditDriver = (driver) => {
    setEditingDriver(driver);
    setNewDriver(driver);
    setShowAddModal(true);
  };

  const handleDeleteDriver = async (driverId) => {
    confirm('Delete this driver?', async () => {
      setDeleting(driverId)
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/drivers/${driverId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          toast.success('Driver deleted successfully')
          fetchDrivers()
        } else {
          toast.error('Failed to delete driver')
        }
      } catch (error) {
        toast.error('Error deleting driver')
      } finally {
        setDeleting(null)
      }
    })
  };

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
    
    if (!newDriver.name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!newDriver.phone.trim()) {
      toast.error('Phone is required')
      return
    }
    if (!newDriver.licenseNumber.trim()) {
      toast.error('License number is required')
      return
    }
    
    try {
      const token = localStorage.getItem('token');
      const url = editingDriver ? `/api/admin/drivers/${editingDriver.id}` : '/api/admin/drivers';
      const response = await fetch(url, {
        method: editingDriver ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDriver)
      });
      
      if (response.ok) {
        toast.success(editingDriver ? 'Driver updated successfully' : 'Driver added successfully')
        setShowAddModal(false);
        setEditingDriver(null);
        setNewDriver({ name: '', phone: '', licenseNumber: '', active: true });
        fetchDrivers();
      } else {
        toast.error('Failed to save driver')
      }
    } catch (error) {
      toast.error('Error saving driver')
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
            <button className="btn btn-sm btn-ghost" onClick={() => handleEditDriver(driver)}>
              <Edit className="w-4 h-4" />
            </button>
          </CanAccess>
          <CanAccess action="delete" subject="Driver" fallback={null}>
            <button 
              className="btn btn-sm btn-ghost text-error" 
              onClick={() => handleDeleteDriver(driver.id)}
              disabled={deleting === driver.id}
            >
              {deleting === driver.id ? (
                <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </CanAccess>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20"></div>
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0"></div>
          </div>
          <div className="text-sm text-base-content/70 animate-pulse">Loading...</div>
        </div>
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
            <h3 className="font-bold text-lg mb-4">{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
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
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDriver ? 'Update' : 'Add'} Driver
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