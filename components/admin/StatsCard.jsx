import { TrendingUp, TrendingDown } from 'lucide-react'

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error'
}

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) {
  const colorClass = colorClasses[color] || 'text-primary'
  
  return (
    <div className="stat bg-base-100 shadow rounded-lg">
      <div className={`stat-figure ${colorClass}`}>
        <Icon size={32} />
      </div>
      <div className="stat-title">{title}</div>
      <div className={`stat-value ${colorClass}`}>{value}</div>
      {trend && (
        <div className={`stat-desc flex items-center gap-1 ${trend === 'up' ? 'text-success' : 'text-error'}`}>
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {trendValue}
        </div>
      )}
    </div>
  )
}