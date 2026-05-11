import { Toaster, toast } from 'react-hot-toast'

export const showSuccess = (msg) => toast.success(msg, {
  style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #22d3ee' },
  iconTheme: { primary: '#22d3ee', secondary: '#0f172a' }
})

export const showError = (msg) => toast.error(msg, {
  style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #f87171' },
  iconTheme: { primary: '#f87171', secondary: '#0f172a' }
})

export const showLoading = (msg) => toast.loading(msg, {
  style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #6366f1' }
})

export const dismissToast = (id) => toast.dismiss(id)

function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { background: '#1e293b', color: '#f1f5f9' }
      }}
    />
  )
}

export default ToastProvider