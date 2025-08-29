'use client'
import { memo, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePermissions } from '@/hooks/usePermissions'
import { useSidebar } from '@/app/admin/layout'
import { 
  BarChart3, Calendar, Car, Users, UserCheck, MapPin, 
  DollarSign, TrendingUp, Settings, Clock, ChevronDown,
  Plus, List, Shield, FileText
} from 'lucide-react'

const menuItems = [
  { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
  {
    label: 'Bookings',
    icon: Calendar,
    permission: { resource: 'bookings', action: 'read' },
    submenu: [
      { path: '/admin/create-booking', icon: Plus, label: 'Create Booking', permission: { resource: 'bookings', action: 'create' } },
      { path: '/admin/bookings', icon: List, label: 'All Bookings', permission: { resource: 'bookings', action: 'read' } }
    ]
  },
  { path: '/admin/cars', icon: Car, label: 'Cars', permission: { resource: 'cars', action: 'read' } },
  { path: '/admin/customers', icon: Users, label: 'Customers', permission: { resource: 'customers', action: 'read' } },
  {
    label: 'Drivers',
    icon: UserCheck,
    permission: { resource: 'drivers', action: 'read' },
    submenu: [
      { path: '/admin/drivers', icon: List, label: 'All Drivers', permission: { resource: 'drivers', action: 'read' } },
      { path: '/admin/drivers/schedule', icon: Clock, label: 'Schedules', permission: { resource: 'schedule', action: 'read' } }
    ]
  },
  { path: '/admin/leave-management', icon: Calendar, label: 'Leave Management', permission: { resource: 'leaves', action: 'read' } },
  { path: '/admin/maintenance', icon: Settings, label: 'Maintenance', permission: { resource: 'maintenance', action: 'read' } },
  { path: '/admin/locations', icon: MapPin, label: 'Locations' },
  { path: '/admin/pricing', icon: DollarSign, label: 'Pricing' },
  {
    label: 'Management',
    icon: Settings,
    permission: { resource: 'staff', action: 'read' },
    submenu: [
      { path: '/admin/staff', icon: Users, label: 'Staff & Permissions', permission: { resource: 'staff', action: 'read' } },
      { path: '/admin/settings', icon: Settings, label: 'Settings' }
    ]
  },
  { path: '/admin/reports', icon: TrendingUp, label: 'Reports', permission: { resource: 'reports', action: 'read' } }
]

function AdminSidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState({})
  const { hasPermission } = usePermissions()
  const { sidebarOpen } = useSidebar()

  const toggleMenu = useCallback((label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }))
  }, [])

  const renderMenuItem = (item) => {
    const Icon = item.icon
    
    // Check permissions for menu items
    if (item.permission && !hasPermission(item.permission.resource, item.permission.action)) {
      return null
    }
    
    if (item.submenu) {
      const isOpen = openMenus[item.label]
      const hasActiveChild = item.submenu.some(sub => pathname === sub.path)
      
      return (
        <li key={item.label}>
          <details open={isOpen || hasActiveChild}>
            <summary 
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault()
                toggleMenu(item.label)
              }}
            >
              <Icon size={16} />
              {item.label}
            </summary>
            <ul>
              {item.submenu.map(subItem => {
                // Check permissions for submenu items
                if (subItem.permission && !hasPermission(subItem.permission.resource, subItem.permission.action)) {
                  return null
                }
                
                const SubIcon = subItem.icon
                return (
                  <li key={subItem.path}>
                    <Link 
                      href={subItem.path}
                      className={`flex items-center gap-2 ${pathname === subItem.path ? 'active bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg border-l-4 border-accent' : 'hover:bg-gradient-to-r hover:from-base-200 hover:to-base-300 text-base-content'}`}
                    >
                      <SubIcon size={14} />
                      {subItem.label}
                    </Link>
                  </li>
                )
              }).filter(Boolean)}
            </ul>
          </details>
        </li>
      )
    }

    return (
      <li key={item.path}>
        <Link 
          href={item.path}
          className={`flex items-center gap-2 ${pathname === item.path ? 'active bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg border-l-4 border-accent' : 'hover:bg-gradient-to-r hover:from-base-200 hover:to-base-300 text-base-content'}`}
        >
          <Icon size={16} /> {item.label}
        </Link>
      </li>
    )
  }

  return (
    <div className="w-64 bg-base-100 min-h-screen border-r border-base-300">
      <div className="p-4">
        <h2 className={`text-lg font-bold text-base-content mb-4 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          Admin Panel
        </h2>
        <ul className="menu menu-sm w-full">
          {menuItems.map(renderMenuItem)}
        </ul>
      </div>
    </div>
  )
}

export default memo(AdminSidebar)