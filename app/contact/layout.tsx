import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Kontakt',
  description: 'Kontaktirajte ekipo mojkmet.eu z vprašanji kupcev in kmetov.',
  path: '/contact',
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
