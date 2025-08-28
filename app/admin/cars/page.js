'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Plus, Car, Edit, Trash2 } from 'lucide-react';

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

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
    { key: 'make', label: 'Make' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'licensePlate', label: 'License Plate' },
    { key: 'pricePerHour', label: 'Price/Hour', render: (value) => `$${value}` },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`badge ${value === 'available' ? 'badge-success' : 'badge-warning'}`}>
        {value}
      </span>
    )},
    {
      key: 'actions',
      label: 'Actions',
      render: (_, car) => (
        <div className="flex gap-2">
          <button className="btn btn-sm btn-ghost">
            <Edit className="w-4 h-4" />
          </button>
          <button className="btn btn-sm btn-ghost text-error">
            <Trash2 className="w-4 h-4" />
          </button>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Car className="w-8 h-8" />
            Cars Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage your fleet of vehicles</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add Car
        </button>
      </div>

      <DataTable
        data={cars}
        columns={columns}
        searchPlaceholder="Search cars..."
      />
    </div>
  );
}