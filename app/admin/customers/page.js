'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Users, UserPlus, Edit, Trash2 } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerData, setCustomerData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/customers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!customerData.name.trim()) newErrors.name = 'Name is required';
    if (customerData.email && !/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (customerData.phone && !/^[+]?[0-9\s-()]+$/.test(customerData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCustomer = async () => {
    if (!validateForm()) return;
    
    try {
      const token = localStorage.getItem('token');
      const url = editingCustomer ? `/api/admin/customers/${editingCustomer.id}` : '/api/admin/customers';
      const method = editingCustomer ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });
      
      if (response.ok) {
        fetchCustomers();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setCustomerData({ name: customer.name, email: customer.email, phone: customer.phone });
    setShowModal(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
    setCustomerData({ name: '', email: '', phone: '' });
    setErrors({});
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
          <button className="btn btn-sm btn-ghost" onClick={() => handleEditCustomer(customer)}>
            <Edit className="w-4 h-4" />
          </button>
          <button className="btn btn-sm btn-ghost text-error" onClick={() => handleDeleteCustomer(customer.id)}>
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
            Customers
          </h1>
        </div>
      </div>

      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search customers..."
      />

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Name *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                value={customerData.name}
                onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
              />
              {errors.name && <span className="text-error text-sm">{errors.name}</span>}
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email (optional)</span>
              </label>
              <input
                type="email"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                value={customerData.email}
                onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
              />
              {errors.email && <span className="text-error text-sm">{errors.email}</span>}
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Phone (optional)</span>
              </label>
              <input
                type="tel"
                className={`input input-bordered ${errors.phone ? 'input-error' : ''}`}
                value={customerData.phone}
                onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
              />
              {errors.phone && <span className="text-error text-sm">{errors.phone}</span>}
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveCustomer}>
                {editingCustomer ? 'Update' : 'Add'} Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}