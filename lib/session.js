export const clearSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('selectedCar')
    localStorage.removeItem('lockData')
  }
}

export const redirectToLogin = () => {
  clearSession()
  window.location.href = '/login'
}