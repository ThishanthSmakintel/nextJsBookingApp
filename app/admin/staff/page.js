'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Users, UserPlus, Edit, Trash2, Shield } from 'lucide-react';

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/admin/staff');
      const data = await response.json();
      setStaff(data.staff || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (value) => (
      <span className={`badge ${value === 'admin' ? 'badge-error' : value === 'manager' ? 'badge-warning' : 'badge-info'}`}>
        {value}
      </span>
    )},
    { key: 'department', label: 'Department' },
    { key: 'lastLogin', label: 'Last Login' },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`badge ${value === 'active' ? 'badge-success' : 'badge-error'}`}>
        {value}
      </span>
    )},
    {
      key: 'actions',
      label: 'Actions',
      render: (_, staffMember) => (
        <div className="flex gap-2">
          <button className="btn btn-sm btn-ghost">
            <Edit className="w-4 h-4" />
          </button>
          <button className="btn btn-sm btn-ghost">
            <Shield className="w-4 h-4" />
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
            Staff Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage staff accounts and permissions</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-title">Total Staff</div>
          <div className="stat-value text-primary">{staff.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-title">Active Staff</div>
          <div className="stat-value text-success">{staff.filter(s => s.status === 'active').length}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-title">Admins</div>
          <div className="stat-value text-warning">{staff.filter(s => s.role === 'admin').length}</div>
        </div>
      </div>

      <DataTable
        data={staff}
        columns={columns}
        searchPlaceholder="Search staff..."
      />
    </div>
  );
}