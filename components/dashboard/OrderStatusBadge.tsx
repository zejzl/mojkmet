const statusConfig: Record<string, { label: string; classes: string }> = {
  PENDING: { label: 'V obdelavi', classes: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Potrjeno', classes: 'bg-blue-100 text-blue-800' },
  PREPARING: { label: 'V pripravi', classes: 'bg-orange-100 text-orange-800' },
  READY: { label: 'Pripravljeno', classes: 'bg-green-100 text-green-800' },
  DELIVERED: { label: 'Dostavljeno', classes: 'bg-gray-100 text-gray-800' },
  CANCELLED: { label: 'Preklicano', classes: 'bg-red-100 text-red-800' },
}

interface OrderStatusBadgeProps {
  status: string
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, classes: 'bg-gray-100 text-gray-800' }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  )
}
