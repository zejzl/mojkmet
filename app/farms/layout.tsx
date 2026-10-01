import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Kmetije',
  description:
    'Odkrijte slovenske kmetije, ki prodajajo neposredno kupcem. Poglejte, kaj pridelujejo in od kod prihajajo.',
  path: '/farms',
  passTemplate: true,
})

export default function FarmsLayout({ children }: { children: React.ReactNode }) {
  return children
}
