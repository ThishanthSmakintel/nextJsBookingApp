'use client';

import { useState, useEffect, Suspense } from 'react';
import DataTable from '@/components/admin/DataTable';
import SearchableSelect from '@/components/SearchableSelect';
import { useToast, useConfirm } from '@/components/Toast';
import { Plus, Car, Edit, Trash2 } from 'lucide-react';
import { currencies, formatCurrency } from '@/lib/currency';
import PermissionButton from '@/components/PermissionButton';
import PermissionWrapper from '@/components/PermissionWrapper';

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({ make: '', model: '', year: '', licensePlate: '', pricePerHour: '', currency: 'USD', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const toast = useToast();
  const confirm = useConfirm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, image: reader.result});
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setFormData(car);
    setImagePreview(car.image);
    setShowModal(true);
  };

  const handleDeleteCar = async (carId) => {
    confirm('Are you sure you want to delete this car? This action cannot be undone.', async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/cars/${carId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          toast.success('Car deleted successfully')
          fetchCars()
        } else {
          toast.error('Failed to delete car')
        }
      } catch (error) {
        toast.error('Error deleting car')
      }
    });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/cars', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCars(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'image', label: 'Image', render: (value) => value ? <img src={value} alt="Car" className="w-12 h-8 object-cover rounded" /> : <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">No Image</div> },
    { key: 'make', label: 'Make' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'licensePlate', label: 'License Plate' },
    { key: 'pricePerHour', label: 'Price/Hour', render: (value, car) => formatCurrency(value, car.currency || 'USD') },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`badge ${value === 'available' ? 'badge-success' : 'badge-warning'}`}>
        {value || 'available'}
      </span>
    )},
    {
      key: 'actions',
      label: 'Actions',
      render: (_, car) => (
        <div className="flex gap-2">
          <PermissionButton 
            resource="cars" 
            action="update"
            className="btn btn-sm btn-ghost"
            onClick={() => handleEditCar(car)}
          >
            <Edit className="w-4 h-4" />
          </PermissionButton>
          <PermissionButton 
            resource="cars" 
            action="delete"
            className="btn btn-sm btn-ghost text-error"
            onClick={() => handleDeleteCar(car.id)}
          >
            <Trash2 className="w-4 h-4" />
          </PermissionButton>
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
            <Car className="w-8 h-8" />
            Cars Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage your fleet of vehicles</p>
        </div>
        <PermissionButton 
          resource="cars" 
          action="create"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          Add Car
        </PermissionButton>
      </div>

      <Suspense fallback={<div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
        <DataTable
          data={cars}
          columns={columns}
          searchPlaceholder="Search cars..."
        />
      </Suspense>

      {showModal && (
        <PermissionWrapper resource="cars" action={editingCar ? 'update' : 'create'}>
          <div className="modal modal-open">
            <div className="modal-box">
            <h3 className="font-bold text-lg">{editingCar ? 'Edit Car' : 'Add New Car'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              if (!formData.make.trim()) {
                toast.error('Make is required')
                return
              }
              if (!formData.model.trim()) {
                toast.error('Model is required')
                return
              }
              if (!formData.year || formData.year < 1900) {
                toast.error('Valid year is required')
                return
              }
              if (!formData.licensePlate.trim()) {
                toast.error('License plate is required')
                return
              }
              if (!formData.pricePerHour || formData.pricePerHour <= 0) {
                toast.error('Valid price per hour is required')
                return
              }
              
              try {
                const token = localStorage.getItem('token');
                const url = editingCar ? `/api/admin/cars/${editingCar.id}` : '/api/admin/cars';
                const response = await fetch(url, {
                  method: editingCar ? 'PUT' : 'POST',
                  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
                });
                if (response.ok) {
                  toast.success(editingCar ? 'Car updated successfully' : 'Car added successfully')
                  setShowModal(false);
                  setEditingCar(null);
                  setFormData({ make: '', model: '', year: '', licensePlate: '', pricePerHour: '', currency: 'USD', image: null });
                  setImagePreview(null);
                  fetchCars();
                } else {
                  toast.error('Failed to save car')
                }
              } catch (error) {
                toast.error('Error saving car')
              }
            }} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Make *</span>
                </label>
                <input type="text" className="input input-bordered w-full" value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Model *</span>
                </label>
                <input type="text" className="input input-bordered w-full" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Year *</span>
                </label>
                <input type="number" className="input input-bordered w-full" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">License Plate *</span>
                </label>
                <input type="text" className="input input-bordered w-full" value={formData.licensePlate} onChange={(e) => setFormData({...formData, licensePlate: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price per Hour *</span>
                </label>
                <input type="number" className="input input-bordered w-full" value={formData.pricePerHour} onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Currency *</span>
                </label>
                <SearchableSelect
                  options={currencies}
                  value={formData.currency}
                  onChange={(value) => setFormData({...formData, currency: value})}
                  placeholder="Select currency"
                  searchPlaceholder="Search currencies..."
                />
              </div>
              <div className="form-control">
                <label className="label">Car Image</label>
                <input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-24 object-cover rounded" />}
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => {
                  setShowModal(false);
                  setImagePreview(null);
                }}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingCar ? 'Update' : 'Add'} Car</button>
              </div>
            </form>
            </div>
          </div>
        </PermissionWrapper>
      )}
    </div>
  );
}