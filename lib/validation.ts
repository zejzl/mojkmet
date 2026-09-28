import { NextResponse } from 'next/server'
import { z } from 'zod'

export const emailSchema = z.string().trim().toLowerCase().email().max(254)

export const passwordSchema = z.string().min(8).max(128)

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().trim().min(1).max(100).nullable().optional(),
  role: z.enum(['CONSUMER', 'FARMER']).optional(),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
})

export const forgotPasswordSchema = z.object({ email: emailSchema })

export const resetPasswordSchema = z.object({
  email: emailSchema,
  token: z.string().min(1).max(200),
  password: passwordSchema,
})

export const waitlistSchema = z.object({ email: emailSchema })

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: emailSchema,
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(10).max(5000),
})

export const favoriteSchema = z.object({
  productId: z.string().min(1).max(64),
})

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(64),
        quantity: z.number().int().min(1).max(999),
      })
    )
    .min(1)
    .max(100),
  pickupStartsAt: z.string().datetime(),
  pickupEndsAt: z.string().datetime().optional(),
  phone: z.string().trim().min(3).max(30),
  notes: z.string().trim().max(2000).optional(),
})

export const orderStatusSchema = z.object({
  status: z.enum([
    'AWAITING_PAYMENT',
    'PAID',
    'ACCEPTED',
    'READY',
    'COLLECTED',
    'COMPLETED',
    'CANCELLED',
    'REFUNDED',
  ]),
})

export const optionalCoord = (min: number, max: number) =>
  z.preprocess(
    (v) => {
      if (v === '' || v === null || v === undefined) return undefined
      const n = Number(v)
      return Number.isFinite(n) ? n : v
    },
    z.number().min(min).max(max).optional()
  )

export const farmSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(4000).nullable().optional(),
  address: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().min(1).max(10),
  phone: z.string().trim().max(30).optional(),
  website: z.union([z.string().trim().url().max(200), z.literal('')]).nullable().optional(),
  minOrder: z.coerce.number().min(0).max(100000).optional(),
  latitude: optionalCoord(-90, 90),
  longitude: optionalCoord(-180, 180),
})

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

const pickupWindowBase = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(timeRegex, 'Neveljaven čas (HH:MM)'),
  endTime: z.string().regex(timeRegex, 'Neveljaven čas (HH:MM)'),
  active: z.boolean().optional(),
})

export const pickupWindowSchema = pickupWindowBase.refine((w) => w.endTime > w.startTime, {
  message: 'Konec termina mora biti za začetkom.',
  path: ['endTime'],
})

export const pickupWindowUpdateSchema = pickupWindowBase
  .partial()
  .refine((w) => w.dayOfWeek !== undefined || w.startTime || w.endTime || w.active !== undefined, {
    message: 'Ni podatkov za posodobitev',
  })

export const pickupChangeSchema = z.object({
  orderId: z.string().min(1).max(64),
  requestedBy: z.enum(['FARMER', 'CONSUMER']),
  proposedStart: z.string().datetime(),
  proposedEnd: z.string().datetime(),
  reason: z.string().trim().max(1000).optional(),
})

export const pickupChangeActionSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT', 'CANCEL']),
})

export const profileSchema = z.object({
  name: z.string().trim().max(100).nullable().optional(),
  email: emailSchema,
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: passwordSchema,
})

export const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().max(5000).nullable().optional(),
  price: z.coerce.number().min(0.01).max(100000),
  unit: z.string().trim().min(1).max(20).default('kg'),
  stock: z.coerce.number().int().min(0).max(999999),
  categoryId: z.string().min(1).max(64),
  available: z.boolean().optional(),
})

export const productUpdateSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  description: z.string().max(5000).nullable().optional(),
  price: z.coerce.number().min(0.01).max(100000).optional(),
  unit: z.string().trim().min(1).max(20).optional(),
  stock: z.coerce.number().int().min(0).max(999999).optional(),
  categoryId: z.string().min(1).max(64).optional(),
  available: z.boolean().optional(),
})

type ParseResult<T extends z.ZodTypeAny> =
  | { ok: true; data: z.infer<T> }
  | { ok: false; error: NextResponse }

export async function parseJson<T extends z.ZodTypeAny>(
  schema: T,
  request: Request
): Promise<ParseResult<T>> {
  const raw = await request.json().catch(() => null)
  const result = schema.safeParse(raw)
  if (!result.success) {
    const message = result.error.issues[0]?.message || 'Neveljaven vnos.'
    return { ok: false, error: NextResponse.json({ error: message }, { status: 400 }) }
  }
  return { ok: true, data: result.data }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}