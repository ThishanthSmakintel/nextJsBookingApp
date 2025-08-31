'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import SearchableSelect from '@/components/SearchableSelect';
import { useToast } from '@/components/Toast';
import { DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { currencies, formatCurrency } from '@/lib/currency';

export default function PricingPage() {
  const [pricingRules, setPricingRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({ category: '', dailyRate: '', kmRate: '', currency: 'USD', weekendRate: '' });
  const toast = useToast();

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setFormData(rule);
    setShowModal(true);
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      const response = await fetch(`/api/admin/pricing/${ruleId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        toast.success('Pricing rule deleted successfully')
        fetchPricingRules()
      } else {
        toast.error('Failed to delete pricing rule')
      }
    } catch (error) {
      toast.error('Error deleting pricing rule')
    }
  };

  useEffect(() => {
    fetchPricingRules();
  }, []);

  const fetchPricingRules = async () => {
    try {
      const response = await fetch('/api/admin/pricing');
      const data = await response.json();
      setPricingRules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'category', label: 'Category' },
    { key: 'dailyRate', label: 'Daily Rate', render: (value, rule) => formatCurrency(value, rule.currency) },
    { key: 'kmRate', label: 'Per KM Rate', render: (value, rule) => value ? formatCurrency(value, rule.currency) : 'N/A' },
    { key: 'weekendRate', label: 'Weekend Rate', render: (value, rule) => value ? formatCurrency(value, rule.currency) : 'N/A' },
    { key: 'currency', label: 'Currency' },
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
          <button className="btn btn-sm btn-ghost" onClick={() => handleEditRule(rule)}>
            <Edit className="w-4 h-4" />
          </button>
          <button className="btn btn-sm btn-ghost text-error" onClick={() => handleDeleteRule(rule.id)}>
            <Trash2 className="w-4 h-4" />
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
            <DollarSign className="w-8 h-8" />
            Pricing Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage pricing rules and rates</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Add Pricing Rule
        </button>
      </div>

      <DataTable
        data={pricingRules}
        columns={columns}
        searchPlaceholder="Search pricing rules..."
      />

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{editingRule ? 'Edit Pricing Rule' : 'Add Pricing Rule'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              if (!formData.category.trim()) {
                toast.error('Category is required')
                return
              }
              if (!formData.dailyRate || formData.dailyRate <= 0) {
                toast.error('Valid daily rate is required')
                return
              }
              
              try {
                const url = editingRule ? `/api/admin/pricing/${editingRule.id}` : '/api/admin/pricing';
                const response = await fetch(url, {
                  method: editingRule ? 'PUT' : 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
                });
                if (response.ok) {
                  toast.success(editingRule ? 'Pricing rule updated successfully' : 'Pricing rule added successfully')
                  setShowModal(false);
                  setEditingRule(null);
                  setFormData({ category: '', dailyRate: '', kmRate: '', currency: 'USD', weekendRate: '' });
                  fetchPricingRules();
                } else {
                  toast.error('Failed to save pricing rule')
                }
              } catch (error) {
                toast.error('Error saving pricing rule')
              }
            }} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Category *</span></label>
                <input type="text" className="input input-bordered w-full" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Daily Rate *</span></label>
                <input type="number" className="input input-bordered w-full" value={formData.dailyRate} onChange={(e) => setFormData({...formData, dailyRate: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Per KM Rate</span></label>
                <input type="number" step="0.01" className="input input-bordered w-full" value={formData.kmRate} onChange={(e) => setFormData({...formData, kmRate: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Weekend Rate</span></label>
                <input type="number" className="input input-bordered w-full" value={formData.weekendRate} onChange={(e) => setFormData({...formData, weekendRate: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Currency *</span></label>
                <SearchableSelect
                  options={currencies}
                  value={formData.currency}
                  onChange={(value) => setFormData({...formData, currency: value})}
                  placeholder="Select currency"
                  searchPlaceholder="Search currencies..."
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingRule ? 'Update' : 'Add'} Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}