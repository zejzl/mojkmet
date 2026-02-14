'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  show: boolean
  onClose: () => void
}

export default function Toast({ message, show, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300) // Wait for fade-out animation
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show && !visible) return null

  return (
    <div
      className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <span className="text-lg">✓</span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
}
