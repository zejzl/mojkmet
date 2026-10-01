import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Proizvodi',
  description:
    'Sveži pridelki neposredno od slovenskih kmetov: mleko, jajca, zelenjava, sadje, meso, med in več.',
  path: '/products',
  passTemplate: true,
})

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children
}
