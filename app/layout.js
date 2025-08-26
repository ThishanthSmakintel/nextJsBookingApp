'use client'
import './globals.css'
import { useEffect } from 'react'
import { driver } from 'driver.js'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({ children }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('tour-completed')) {
      const driverObj = driver({
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        progressText: 'Step {{current}} of {{total}}',
        nextBtnText: 'Next →',
        prevBtnText: '← Previous',
        doneBtnText: 'Get Started!',
        steps: [
          { 
            element: '#logo', 
            popover: { 
              title: 'Welcome to CarBook!', 
              description: 'Your modern car booking platform with real-time reservations and automatic driver assignment.',
              side: 'bottom',
              align: 'start'
            } 
          },
          { 
            element: '#search-btn', 
            popover: { 
              title: 'Search Available Cars', 
              description: 'Browse our fleet by location, date, and category. All cars are available for instant booking.',
              side: 'bottom'
            } 
          },
          { 
            element: '#login-btn', 
            popover: { 
              title: 'Access Your Account', 
              description: 'Login to book cars, manage reservations, and track your booking history.',
              side: 'bottom'
            } 
          }
        ],
        onDestroyed: () => {
          localStorage.setItem('tour-completed', 'true')
        }
      })
      setTimeout(() => driverObj.drive(), 1500)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <title>CarBook - Modern Car Booking</title>
        <meta name="description" content="Event-driven car rental platform with real-time booking" />
      </head>
      <body className="min-h-screen">
        <AuthProvider>
          <div className="drawer">
            <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
              <Header />
              <main className="flex-1 bg-base-200">{children}</main>
            </div>
            <div className="drawer-side">
              <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
              <Sidebar />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}