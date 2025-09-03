'use client'
import { createContext, useContext, useState } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export const useConfirm = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useConfirm must be used within ToastProvider')
  return context.confirm
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 5000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (message) => addToast(message, 'success')
  const error = (message) => addToast(message, 'error')
  const info = (message) => addToast(message, 'info')
  
  const confirm = (message, onConfirm) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type: 'confirm', onConfirm }])
  }

  return (
    <ToastContext.Provider value={{ success, error, info, confirm }}>
      {children}
      <div className="toast toast-top toast-end z-50">
        {toasts.map(toast => {
          const alertClass = toast.type === 'success' ? 'alert-success' : 
                           toast.type === 'error' ? 'alert-error' : 
                           toast.type === 'confirm' ? 'alert-warning' : 'alert-info'
          
          return (
            <div key={toast.id} className={`alert ${alertClass}`}>
              {toast.type === 'success' && <CheckCircle className="w-4 h-4" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
              {toast.type === 'info' && <Info className="w-4 h-4" />}
              {toast.type === 'confirm' && <AlertCircle className="w-4 h-4" />}
              <span>{toast.message}</span>
              {toast.type === 'confirm' ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      try {
                        toast.onConfirm()
                      } catch (error) {
                        console.error('Toast onConfirm error:', error)
                      }
                      removeToast(toast.id)
                    }} 
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                  <button onClick={() => removeToast(toast.id)} className="btn btn-sm btn-ghost">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => removeToast(toast.id)} className="btn btn-sm btn-ghost">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}