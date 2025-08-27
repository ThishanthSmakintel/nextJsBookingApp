'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <MapPin className="w-8 h-8" />
            Locations Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage pickup and drop-off locations</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      <DataTable
        data={locations}
        columns={columns}
        searchPlaceholder="Search locations..."
      />
    </div>
  );
}