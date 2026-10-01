import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site'

export const alt = `${SITE_NAME} - ${SITE_TAGLINE}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Default share image for every page that doesn't define its own
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 96px',
        background: 'linear-gradient(135deg, #16a34a 0%, #166534 100%)',
        color: 'white',
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 700, opacity: 0.9 }}>{SITE_NAME}</div>
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>
        {SITE_TAGLINE}
      </div>
      <div style={{ fontSize: 34, marginTop: 36, opacity: 0.9 }}>
        Pridelki slovenskih kmetij, prevzem na kmetiji
      </div>
    </div>,
    size
  )
}
