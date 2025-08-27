'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Users, UserPlus, Edit, Trash2 } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'totalBookings', label: 'Total Bookings' },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`badge ${value === 'active' ? 'badge-success' : 'badge-error'}`}>
        {value}
      </span>
    )},
    {
      key: 'actions',
      label: 'Actions',
      render: (_, customer) => (
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
            <Users className="w-8 h-8" />
            Customers Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage customer accounts and information</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search customers..."
      />
    </div>
  );
}