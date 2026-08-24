// Fetches site-wide settings (currently just the logo) from Strapi.
// Used by every page.tsx so the header logo is managed from the CMS
// instead of being hardcoded in each client component.

export interface SiteSettings {
  logoUrl: string
  logoAlt: string
}

const EMPTY_SETTINGS: SiteSettings = { logoUrl: '', logoAlt: 'The Prospective Interiors' }

export async function getSiteSettings(): Promise<SiteSettings> {
  // STRAPI = internal Docker network address, used for server-side fetches (container-to-container).
  // STRAPI_PUBLIC = browser-facing address, used when building <img> src URLs so the browser can load them.
  const STRAPI = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const STRAPI_PUBLIC = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const TOKEN = process.env.STRAPI_API_TOKEN || ''
  const headers = { Authorization: `Bearer ${TOKEN}` }

  try {
    const res = await fetch(`${STRAPI}/api/site-setting?populate=logo`, { headers, next: { revalidate: 60 } })
    if (!res.ok) return EMPTY_SETTINGS

    const json = await res.json()
    const settings = json?.data ?? {}

    const media = settings.logo
    const url = media?.url ?? media?.data?.attributes?.url ?? ''
    const logoUrl = url ? (url.startsWith('http') ? url : `${STRAPI_PUBLIC}${url}`) : ''

    return {
      logoUrl,
      logoAlt: settings.logoAltText || EMPTY_SETTINGS.logoAlt,
    }
  } catch (error) {
    console.error('Site settings error (Strapi unreachable, using fallback logo):', error)
    return EMPTY_SETTINGS
  }
}