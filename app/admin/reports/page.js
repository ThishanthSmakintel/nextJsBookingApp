'use client';

import { useState, useEffect } from 'react';
import StatsCard from '@/components/admin/StatsCard';
import { BarChart3, Download, Calendar, TrendingUp, Users, Car, DollarSign } from 'lucide-react';

export default function ReportsPage() {
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7');

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/admin/reports/export?range=${dateRange}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${dateRange}days.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

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
            <BarChart3 className="w-8 h-8" />
            Reports & Analytics
          </h1>
          <p className="text-base-content/70 mt-1">View business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select className="select select-bordered" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          <button className="btn btn-primary" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={reportData.totalRevenue || "$0"}
          change={reportData.revenueChange || "0%"}
          trend={reportData.revenueTrend || "neutral"}
          icon={DollarSign}
        />
        <StatsCard
          title="Total Bookings"
          value={reportData.totalBookings || "0"}
          change={reportData.bookingsChange || "0%"}
          trend={reportData.bookingsTrend || "neutral"}
          icon={Calendar}
        />
        <StatsCard
          title="Active Users"
          value={reportData.activeUsers || "0"}
          change={reportData.usersChange || "0%"}
          trend={reportData.usersTrend || "neutral"}
          icon={Users}
        />
        <StatsCard
          title="Fleet Utilization"
          value={reportData.fleetUtilization || "0%"}
          change={reportData.utilizationChange || "0%"}
          trend={reportData.utilizationTrend || "neutral"}
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