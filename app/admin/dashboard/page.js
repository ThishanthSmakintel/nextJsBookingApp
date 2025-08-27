'use client';

import { useState, useEffect } from 'react';
import StatsCard from '@/components/admin/StatsCard';
import QuickActions from '@/components/admin/QuickActions';
import { LayoutDashboard, Users, Car, Calendar, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8" />
          Admin Dashboard
        </h1>
        <p className="text-base-content/70 mt-1">Overview of your car booking system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Bookings"
          value="1,234"
          change="+12.5%"
          trend="up"
          icon={Calendar}
        />
        <StatsCard
          title="Active Users"
          value="892"
          change="+8.2%"
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Available Cars"
          value="45"
          change="-2.1%"
          trend="down"
          icon={Car}
        />
        <StatsCard
          title="Revenue"
          value="$23,450"
          change="+15.3%"
          trend="up"
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm font-medium">New booking confirmed</p>
                  <p className="text-xs text-base-content/70">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-sm font-medium">Car maintenance due</p>
                  <p className="text-xs text-base-content/70">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-info" />
                <div>
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-base-content/70">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}