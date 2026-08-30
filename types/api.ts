export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED'

export interface OrderItem {
  id: string
  productName: string
  farmName?: string
  quantity: number
  price: number
  unit: string
}

export interface Order {
  id: string
  status: OrderStatus
  totalAmount: number
  createdAt: string | Date
  deliveryAddress?: string | null
  deliveryCity?: string | null
  deliveryPostal?: string | null
  phone?: string | null
  notes?: string | null
  buyer?: { name: string | null; email: string } | null
  items: OrderItem[]
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