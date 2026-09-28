export type OrderStatus =
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'ACCEPTED'
  | 'READY'
  | 'COLLECTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface OrderItem {
  id: string
  productName: string
  farmName?: string
  quantity: number
  price: number
  unit: string
}

export interface PickupWindow {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  active: boolean
}

export type PickupChangeStatus = 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'

export interface PickupChange {
  id: string
  orderId: string
  requestedBy: 'FARMER' | 'CONSUMER'
  currentStart: string | Date
  currentEnd: string | Date
  proposedStart: string | Date
  proposedEnd: string | Date
  reason: string | null
  status: PickupChangeStatus
  createdAt: string | Date
  respondedAt: string | Date | null
}

export interface Order {
  id: string
  status: OrderStatus
  subtotal: number
  platformFee?: number | null
  payoutAmount?: number | null
  createdAt: string | Date
  farmId?: string
  farmName?: string
  pickupStartsAt?: string | Date | null
  pickupEndsAt?: string | Date | null
  phone?: string | null
  notes?: string | null
  buyer?: { name: string | null; email: string } | null
  items: OrderItem[]
  activePickupChange?: PickupChange | null
}

export interface ConsumerStats {
  role: 'CONSUMER'
  totalOrders: number
  activeOrders: number
  favorites: number
}

export interface FarmerStats {
  role: 'FARMER'
  hasFarm: boolean
  products: number
  ordersReceived: number
  avgRating: number
  totalRevenue: number
  reviewCount?: number
}

export interface Favorite {
  id: string
  productId: string
  createdAt: string
  product: {
    id: string
    name: string
    price: number
    unit: string
    stock: number
    available: boolean
    image: string | null
    categoryIcon: string
    farmId: string
    farmName: string
    farmCity: string
  }
}

export interface CategoryOption {
  id: string
  name: string
  slug: string
  icon: string
}

export interface UserProfile {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
}

export interface ProductRow {
  id: string
  name: string
  description: string | null
  price: number
  unit: string
  stock: number
  available: boolean
  image: string | null
  category?: { name: string; slug: string } | null
}