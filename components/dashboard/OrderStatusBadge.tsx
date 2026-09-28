const statusConfig: Record<string, { label: string; classes: string }> = {
  AWAITING_PAYMENT: { label: 'Čaka na plačilo', classes: 'bg-amber-100 text-amber-800' },
  PAID: { label: 'Plačano', classes: 'bg-blue-100 text-blue-800' },
  ACCEPTED: { label: 'Sprejeto', classes: 'bg-teal-100 text-teal-800' },
  READY: { label: 'Pripravljeno', classes: 'bg-green-100 text-green-800' },
  COLLECTED: { label: 'Prevzeto', classes: 'bg-cyan-100 text-cyan-800' },
  COMPLETED: { label: 'Zaključeno', classes: 'bg-gray-100 text-gray-800' },
  CANCELLED: { label: 'Preklicano', classes: 'bg-red-100 text-red-800' },
  REFUNDED: { label: 'Vrnjeno', classes: 'bg-purple-100 text-purple-800' },
}

interface OrderStatusBadgeProps {
  status: string
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, classes: 'bg-gray-100 text-gray-800' }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  )
}
