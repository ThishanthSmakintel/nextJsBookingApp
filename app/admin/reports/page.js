'use client';

import { useState, useEffect } from 'react';
import StatsCard from '@/components/admin/StatsCard';
import { BarChart3, Download, Calendar, TrendingUp, Users, Car, DollarSign } from 'lucide-react';

export default function ReportsPage() {
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await fetch('/api/admin/reports');
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <BarChart3 className="w-8 h-8" />
            Reports & Analytics
          </h1>
          <p className="text-base-content/70 mt-1">View business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select className="select select-bordered">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
          <button className="btn btn-primary">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value="$45,230"
          change="+12.5%"
          trend="up"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Bookings"
          value="1,234"
          change="+8.2%"
          trend="up"
          icon={Calendar}
        />
        <StatsCard
          title="Active Users"
          value="892"
          change="+15.3%"
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Fleet Utilization"
          value="78%"
          change="+5.1%"
          trend="up"
          icon={Car}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Revenue Trends</h2>
            <div className="h-64 flex items-center justify-center text-base-content/50">
              Chart placeholder - Revenue over time
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Booking Patterns</h2>
            <div className="h-64 flex items-center justify-center text-base-content/50">
              Chart placeholder - Bookings by hour/day
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Popular Car Types</h2>
            <div className="h-64 flex items-center justify-center text-base-content/50">
              Chart placeholder - Car type preferences
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Geographic Distribution</h2>
            <div className="h-64 flex items-center justify-center text-base-content/50">
              Chart placeholder - Bookings by location
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}