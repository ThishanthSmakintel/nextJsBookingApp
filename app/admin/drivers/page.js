'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { UserCheck, UserPlus, Edit, Trash2 } from 'lucide-react';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await fetch('/api/admin/drivers');
      const data = await response.json();
      setDrivers(data.drivers || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'licenseNumber', label: 'License Number' },
    { key: 'totalTrips', label: 'Total Trips' },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`badge ${value === 'available' ? 'badge-success' : value === 'busy' ? 'badge-warning' : 'badge-error'}`}>
        {value}
      </span>
    )},
    {
      key: 'actions',
      label: 'Actions',
      render: (_, driver) => (
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
            <UserCheck className="w-8 h-8" />
            Drivers Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage driver accounts and assignments</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      <DataTable
        data={drivers}
        columns={columns}
        searchPlaceholder="Search drivers..."
      />
    </div>
  );
}