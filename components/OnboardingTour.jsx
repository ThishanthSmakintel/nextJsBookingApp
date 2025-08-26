'use client'
import { useEffect } from 'react'
import { driver } from 'driver.js'

export default function OnboardingTour({ tourKey, steps, autoStart = true }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem(tourKey) && autoStart) {
      const driverObj = driver({
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        steps: steps,
        onDestroyed: () => {
          localStorage.setItem(tourKey, 'completed')
        }
      })
      
      setTimeout(() => {
        driverObj.drive()
      }, 1000)
    }
  }, [tourKey, steps, autoStart])

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: steps
    })
    driverObj.drive()
  }

  return (
    <button 
      onClick={startTour}
      className="btn btn-ghost btn-sm"
      title="Take a tour"
    >
      ❓ Help
    </button>
  )
}