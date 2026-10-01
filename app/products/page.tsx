import { getProductsList } from '@/lib/catalog'
import { getErrorMessage } from '@/lib/errors'
import ProductsClient from './ProductsClient'

// Depends on ?category= / ?search=, so it renders per request anyway.
export const dynamic = 'force-dynamic'

function first(value: string | string[] | undefined): string | null {
  const v = Array.isArray(value) ? value[0] : value
  return v ? v : null
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const category = first(params.category)
  const search = first(params.search)

  // If the database call fails, fall back to the client component's own fetch + error UI
  // instead of failing the whole page.
  let initialData: Awaited<ReturnType<typeof getProductsList>> | null = null
  try {
    initialData = await getProductsList({ category, search })
  } catch (err) {
    getErrorMessage(err, 'Products page: server-side load failed')
  }

  const key = `${category ?? ''}|${search ?? ''}`

  // `key` remounts the client component when the filter changes, so it always starts from the
  // fresh server data for that filter (no stale state, no second fetch).
  return <ProductsClient key={key} initialData={initialData} initialKey={key} />
}
