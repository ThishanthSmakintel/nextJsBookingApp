'use client';

import { useState, useEffect, Suspense } from 'react';
import DataTable from '@/components/admin/DataTable';
import { useToast, useConfirm } from '@/components/Toast';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '', city: '' });
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();
  const confirm = useConfirm();

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setFormData(location);
    setShowModal(true);
  };

  const handleDeleteLocation = async (locationId) => {
    confirm('Delete this location?', async () => {
      setDeleting(locationId)
      try {
        const response = await fetch(`/api/admin/locations/${locationId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          toast.success('Location deleted successfully')
          fetchLocations()
        } else {
          toast.error('Failed to delete location')
        }
      } catch (error) {
        toast.error('Error deleting location')
      } finally {
        setDeleting(null)
      }
    })
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/admin/locations');
      const data = await response.json();
      setLocations(data.locations || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingLocation ? `/api/admin/locations/${editingLocation.id}` : '/api/admin/locations';
      const response = await fetch(url, {
        method: editingLocation ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        toast.success(editingLocation ? 'Location updated successfully' : 'Location added successfully')
        setShowModal(false);
        setEditingLocation(null);
        setFormData({ name: '', address: '', city: '' });
        fetchLocations();
      } else {
        toast.error('Failed to save location')
      }
    } catch (error) {
      toast.error('Error saving location')
    }
  };

  const columns = [
    { key: 'name', label: 'Location Name' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'availableCars', label: 'Available Cars' },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`badge ${value === 'active' ? 'badge-success' : 'badge-error'}`}>
        {value}
      </span>
    )},
    {
      key: 'actions',
      label: 'Actions',
      render: (_, location) => (
        <div className="flex gap-2">
          <button className="btn btn-sm btn-ghost" onClick={() => handleEditLocation(location)}>
            <Edit className="w-4 h-4" />
          </button>
          <button 
            className="btn btn-sm btn-ghost text-error" 
            onClick={() => handleDeleteLocation(location.id)}
            disabled={deleting === location.id}
          >
            {deleting === location.id ? (
              <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="w-8 h-8" />
            Locations Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage pickup and drop-off locations</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      <Suspense fallback={<div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
        <DataTable
          data={locations}
          columns={columns}
          searchPlaceholder="Search locations..."
        />
      </Suspense>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{editingLocation ? 'Edit Location' : 'Add New Location'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location Name *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Address *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">City *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingLocation ? 'Update' : 'Add'} Location</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}