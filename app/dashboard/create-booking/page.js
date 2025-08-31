'use client';

import { useState, useEffect } from 'react';
import { Plus, User, Car, Calendar, MapPin, DollarSign } from 'lucide-react';

export default function CreateBookingPage() {
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState({
    email: '',
    name: '',
    phone: '',
    isExisting: false
  });
  const [booking, setBooking] = useState({
    carId: '',
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    notes: ''
  });
  const [cars, setCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const convertToGoogleMapsLink = (location) => {
    if (!location) return '';
    
    // If already a Google Maps link, return as is
    if (location.includes('maps.google.com') || location.includes('goo.gl/maps')) {
      return location;
    }
    
    // If GPS coordinates (lat,lng format)
    if (/^-?\d+\.\d+,-?\d+\.\d+$/.test(location.trim())) {
      return `https://maps.google.com/?q=${location.trim()}`;
    }
    
    // If address or any other text, encode for Google Maps search
    return `https://maps.google.com/?q=${encodeURIComponent(location)}`;
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [carsRes, locationsRes, customersRes] = await Promise.all([
        fetch('/api/admin/cars', { headers }),
        fetch('/api/locations'),
        fetch('/api/admin/customers', { headers })
      ]);
      
      const carsData = await carsRes.json();
      const locationsData = await locationsRes.json();
      const customersData = await customersRes.json();
      
      setCars(Array.isArray(carsData) ? carsData : []);
      setLocations(Array.isArray(locationsData) ? locationsData : []);
      setExistingCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCustomerSelect = (selectedCustomer) => {
    setCustomer({
      ...selectedCustomer,
      isExisting: true
    });
  };

  const createBooking = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Create or get customer
      let customerId;
      if (customer.isExisting) {
        customerId = customer.id;
      } else {
        const customerRes = await fetch('/api/admin/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: customer.email,
            name: customer.name,
            phone: customer.phone,
            skipOtpVerification: true
          })
        });
        const newCustomer = await customerRes.json();
        customerId = newCustomer.id;
      }

      // Create booking
      const bookingRes = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId,
          carId: booking.carId,
          startTime: booking.startDate,
          endTime: booking.endDate,
          totalPrice: 100,
          pricingMode: 'DAILY',
          withDriver: false,
          pickupLocation: booking.pickupLocation,
          dropoffLocation: booking.dropoffLocation,
          notes: booking.notes
        })
      });

      if (bookingRes.ok) {
        alert('Booking created successfully!');
        // Reset form
        setStep(1);
        setCustomer({ email: '', name: '', phone: '', isExisting: false });
        setBooking({ carId: '', startDate: '', endDate: '', pickupLocation: '', dropoffLocation: '', notes: '' });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Plus className="w-8 h-8" />
          Create Booking
        </h1>
        <p className="text-base-content/70 mt-1">Create a new booking for existing or new customers</p>
      </div>

      <div className="steps w-full">
        <div className={`step ${step >= 1 ? 'step-primary' : ''}`}>Customer</div>
        <div className={`step ${step >= 2 ? 'step-primary' : ''}`}>Booking Details</div>
        <div className={`step ${step >= 3 ? 'step-primary' : ''}`}>Confirm</div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="card-title flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h2>
              
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Use existing customer</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={customer.isExisting}
                    onChange={(e) => setCustomer(prev => ({ ...prev, isExisting: e.target.checked }))}
                  />
                </label>
              </div>

              {customer.isExisting ? (
                <div className="form-control">
                  <label className="label">Select Customer</label>
                  <select
                    className="select select-bordered"
                    onChange={(e) => {
                      const selected = existingCustomers.find(c => c.id === e.target.value);
                      if (selected) handleCustomerSelect(selected);
                    }}
                  >
                    <option value="">Choose a customer</option>
                    {existingCustomers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - {c.email}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">Name</label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={customer.name}
                      onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Email (optional)</label>
                    <input
                      type="email"
                      className="input input-bordered"
                      value={customer.email}
                      onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="customer@example.com"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Phone (optional)</label>
                    <input
                      type="tel"
                      className="input input-bordered"
                      value={customer.phone}
                      onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              )}

              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(2)}
                  disabled={!customer.name}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="card-title flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Booking Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Select Car</label>
                  <select
                    className="select select-bordered"
                    value={booking.carId}
                    onChange={(e) => setBooking(prev => ({ ...prev, carId: e.target.value }))}
                  >
                    <option value="">Choose a car</option>
                    {cars.map(car => (
                      <option key={car.id} value={car.id}>
                        {car.make} {car.model} - {car.licensePlate}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    className="input input-bordered"
                    value={booking.startDate}
                    onChange={(e) => setBooking(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="form-control">
                  <label className="label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    className="input input-bordered"
                    value={booking.endDate}
                    onChange={(e) => setBooking(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>

                <div className="form-control">
                  <label className="label">Pickup Location</label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={booking.pickupLocation}
                    onChange={(e) => setBooking(prev => ({ ...prev, pickupLocation: e.target.value }))}
                    placeholder="GPS: 40.7128,-74.0060 | Address: 123 Main St | Maps: https://maps.google.com/..."
                  />
                  <div className="label">
                    <span className="label-text-alt">Enter GPS coordinates, address, or Google Maps link</span>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">Drop-off Location</label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={booking.dropoffLocation}
                    onChange={(e) => setBooking(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                    placeholder="GPS: 40.7128,-74.0060 | Address: 123 Main St | Maps: https://maps.google.com/..."
                  />
                  <div className="label">
                    <span className="label-text-alt">Enter GPS coordinates, address, or Google Maps link</span>
                  </div>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">Notes (Optional)</label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={booking.notes}
                    onChange={(e) => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special instructions or notes..."
                  />
                </div>
              </div>

              <div className="card-actions justify-between">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(3)}
                  disabled={!booking.carId || !booking.startDate || !booking.endDate}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="card-title">Confirm Booking</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Customer Details</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p><strong>Name:</strong> {customer.name}</p>
                    <p><strong>Email:</strong> {customer.email || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {customer.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Booking Details</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p><strong>Car:</strong> {cars.find(c => c.id === booking.carId)?.make} {cars.find(c => c.id === booking.carId)?.model}</p>
                    <p><strong>Start:</strong> {new Date(booking.startDate).toLocaleString()}</p>
                    <p><strong>End:</strong> {new Date(booking.endDate).toLocaleString()}</p>
                    <p><strong>Pickup:</strong> 
                      <a href={convertToGoogleMapsLink(booking.pickupLocation)} target="_blank" rel="noopener noreferrer" className="link link-primary">
                        {booking.pickupLocation}
                      </a>
                    </p>
                    <p><strong>Drop-off:</strong> 
                      <a href={convertToGoogleMapsLink(booking.dropoffLocation)} target="_blank" rel="noopener noreferrer" className="link link-primary">
                        {booking.dropoffLocation}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-actions justify-between">
                <button className="btn btn-ghost" onClick={() => setStep(2)}>
                  Back
                </button>
                <button
                  className="btn btn-success"
                  onClick={createBooking}
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Create Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}