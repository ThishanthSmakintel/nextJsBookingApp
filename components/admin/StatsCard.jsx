import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) {
  return (
    <div className="stat bg-base-100 shadow rounded-lg">
      <div className="stat-figure text-primary">
        <Icon size={32} className={`text-${color}`} />
      </div>
      <div className="stat-title">{title}</div>
      <div className={`stat-value text-${color}`}>{value}</div>
      {trend && (
        <div className={`stat-desc flex items-center gap-1 ${trend === 'up' ? 'text-success' : 'text-error'}`}>
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {trendValue}
        </div>
      )}
    </div>
  )
}