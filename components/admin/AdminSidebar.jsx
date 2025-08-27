'use client'
import { useRouter, usePathname } from 'next/navigation'
import { 
  BarChart3, Calendar, Car, Users, UserCheck, MapPin, 
  DollarSign, TrendingUp, Settings 
} from 'lucide-react'

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/admin/cars', icon: Car, label: 'Cars' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/drivers', icon: UserCheck, label: 'Drivers' },
    { path: '/admin/staff', icon: Users, label: 'Staff' },
    { path: '/admin/locations', icon: MapPin, label: 'Locations' },
    { path: '/admin/pricing', icon: DollarSign, label: 'Pricing' },
    { path: '/admin/reports', icon: TrendingUp, label: 'Reports' },
    { path: '/admin/rbac', icon: UserCheck, label: 'RBAC' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="w-64 bg-base-100 min-h-screen p-4">
      <ul className="menu">
        {menuItems.map(item => {
          const Icon = item.icon
          return (
            <li key={item.path}>
              <a 
                className={pathname === item.path ? 'active' : ''} 
                onClick={() => router.push(item.path)}
              >
                <Icon size={16} /> {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}