import { Plus, Download, Upload, RefreshCw } from 'lucide-react'

export default function QuickActions({ onAddCar, onAddDriver, onAddStaff, onRefresh, onExport }) {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="card-title">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-primary btn-sm" onClick={onAddCar}>
            <Plus size={16} /> Add Car
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onAddDriver}>
            <Plus size={16} /> Add Driver
          </button>
          <button className="btn btn-accent btn-sm" onClick={onAddStaff}>
            <Plus size={16} /> Add Staff
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onRefresh}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-outline btn-sm" onClick={onExport}>
            <Download size={16} /> Export
          </button>
          <button className="btn btn-outline btn-sm">
            <Upload size={16} /> Import
          </button>
        </div>
      </div>
    </div>
  )
}