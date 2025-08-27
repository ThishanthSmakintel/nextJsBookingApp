'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { DollarSign, Plus, Edit, Trash2 } from 'lucide-react';

export default function PricingPage() {
  const [pricingRules, setPricingRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricingRules();
  }, []);

  const fetchPricingRules = async () => {
    try {
      const response = await fetch('/api/admin/pricing');
      const data = await response.json();
      setPricingRules(data.pricingRules || []);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Rule Name' },
    { key: 'carType', label: 'Car Type' },
    { key: 'basePrice', label: 'Base Price', render: (value) => `$${value}` },
    { key: 'hourlyRate', label: 'Hourly Rate', render: (value) => `$${value}` },
    { key: 'weekendMultiplier', label: 'Weekend Rate', render: (value) => `${value}x` },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`badge ${value === 'active' ? 'badge-success' : 'badge-error'}`}>
        {value}
      </span>
    )},
    {
      key: 'actions',
      label: 'Actions',
      render: (_, rule) => (
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
            <DollarSign className="w-8 h-8" />
            Pricing Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage pricing rules and rates</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add Pricing Rule
        </button>
      </div>

      <DataTable
        data={pricingRules}
        columns={columns}
        searchPlaceholder="Search pricing rules..."
      />
    </div>
  );
}