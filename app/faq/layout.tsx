import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Pogosta vprašanja',
  description: 'Odgovori na pogosta vprašanja o naročanju, plačilu in prevzemu na mojkmet.eu.',
  path: '/faq',
})

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}
