import { create } from 'zustand'

export const useBookingStore = create((set, get) => ({
  selectedCar: null,
  lockData: null,
  bookingData: null,
  
  setSelectedCar: (car) => set({ selectedCar: car }),
  
  setLockData: (lockData) => set({ lockData }),
  
  clearLock: () => set({ lockData: null }),
  
  setBookingData: (booking) => set({ bookingData: booking }),
  
  reset: () => set({ 
    selectedCar: null, 
    lockData: null, 
    bookingData: null 
  })
}))