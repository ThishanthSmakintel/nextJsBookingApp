'use client';

import QuickActions from '@/components/admin/QuickActions';
import { LayoutDashboard, Users, Car, Calendar, DollarSign } from 'lucide-react';

export default function DashboardPage() {
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
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-primary">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value">0</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-secondary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Active Users</div>
          <div className="stat-value">0</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-accent">
            <Car className="w-8 h-8" />
          </div>
          <div className="stat-title">Available Cars</div>
          <div className="stat-value">0</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-success">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="stat-title">Revenue</div>
          <div className="stat-value">$0</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Recent Activity</h3>
            <div className="space-y-3">
              <p className="text-sm text-base-content/70">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}