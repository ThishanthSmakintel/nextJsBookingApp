'use client'
import { memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, Calendar, Car, Users, UserCheck, MapPin, 
  DollarSign, TrendingUp, Settings, Clock 
} from 'lucide-react'

const menuItems = [
  { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/admin/create-booking', icon: Calendar, label: 'Create Booking' },
  { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/admin/cars', icon: Car, label: 'Cars' },
  { path: '/admin/customers', icon: Users, label: 'Customers' },
  { path: '/admin/drivers', icon: UserCheck, label: 'Drivers' },
  { path: '/admin/drivers/schedule', icon: Clock, label: 'Driver Schedules' },
  { path: '/admin/staff', icon: Users, label: 'Staff' },
  { path: '/admin/locations', icon: MapPin, label: 'Locations' },
  { path: '/admin/pricing', icon: DollarSign, label: 'Pricing' },
  { path: '/admin/reports', icon: TrendingUp, label: 'Reports' },
  { path: '/admin/rbac', icon: UserCheck, label: 'RBAC' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' }
]

function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-base-100 min-h-screen p-4">
      <ul className="menu">
        {menuItems.map(item => {
          const Icon = item.icon
          return (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={pathname === item.path ? 'active' : ''}
              >
                <Icon size={16} /> {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default memo(AdminSidebar)