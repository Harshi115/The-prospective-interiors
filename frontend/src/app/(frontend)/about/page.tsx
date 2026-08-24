import AboutClient from './AboutClient'
import { getSiteSettings } from '../../../lib/site-settings'

export const metadata = {
  title: 'About — The Prospective Interiors',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

async function fetchList(STRAPI: string, headers: any, endpoint: string) {
  try {
    const res = await fetch(`${STRAPI}/api/${endpoint}?sort=order:asc&pagination[limit]=100`, {
      headers,
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json?.data ?? []
  } catch {
    return []
  }
}

export default async function AboutPage() {
  const STRAPI = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const STRAPI_PUBLIC = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const TOKEN = process.env.STRAPI_API_TOKEN || ''
  const headers = { Authorization: `Bearer ${TOKEN}` }

  const getImgUrl = (media: any) => {
    const url = media?.url ?? media?.data?.attributes?.url ?? ''
    return url.startsWith('http') ? url : url ? `${STRAPI_PUBLIC}${url}` : ''
  }

  let pageContent: Record<string, any> = {
    heroHeading: '',
    heroSubHeading: '',
    heroImage: '',
    storyLabel: '',
    storyHeading: '',
    storyPara1: '',
    storyPara2: '',
    storyPara3: '',
    storyImage: '',
    philosophyImage: '',
    philosophyLabel: '',
    philosophyQuote: '',
    philosophyAttribution: '',
    valuesLabel: '',
    servicesLabel: '',
    faqLabel: '',
    galleryImage1: '',
    galleryImage2: '',
    galleryImage3: '',
    galleryImage4: '',
    ctaImage: '',
    ctaHeading: '',
  }

  try {
    const res = await fetch(`${STRAPI}/api/aboutpages?populate[0]=storyImage&populate[1]=philosophyImage&populate[2]=heroimage&populate[3]=gallery&populate[4]=ctaImage`, { headers, next: { revalidate: 60 } })
    if (res.ok) {
      const json = await res.json()
      const data = json?.data?.[0] ?? {}
      const galleryArr = Array.isArray(data.gallery) ? data.gallery : (data.gallery ? [data.gallery] : [])
      const storyImg = Array.isArray(data.storyImage) ? data.storyImage[0] : data.storyImage
      const ctaImg = Array.isArray(data.ctaImage) ? data.ctaImage[0] : data.ctaImage
      pageContent = {
        ...pageContent,
        ...data,
        storyImage: getImgUrl(storyImg) || '',
        philosophyImage: getImgUrl(data.philosophyImage) || '',
        heroImage: getImgUrl(data.heroimage) || '',
        heroSubHeading: data.herosubHeading ?? '',
        galleryImage1: getImgUrl(galleryArr[0]) || '',
        galleryImage2: getImgUrl(galleryArr[1]) || '',
        galleryImage3: getImgUrl(galleryArr[2]) || '',
        galleryImage4: getImgUrl(galleryArr[3]) || '',
        ctaImage: getImgUrl(ctaImg) || '',
        ctaHeading: data.ctaheading ?? '',
      }
    }
  } catch (error) {
    console.error('About page content fetch error (using fallback text):', error)
  }

  const [services, values, faqs, stats, siteSettings] = await Promise.all([
    fetchList(STRAPI, headers, 'services'),
    fetchList(STRAPI, headers, 'values'), // check your actual collection's API ID in Strapi and rename if different
    fetchList(STRAPI, headers, 'faqs'),
    fetchList(STRAPI, headers, 'stats'),
    getSiteSettings(),
  ])

  return (
    <AboutClient
      pageContent={pageContent}
      logoUrl={siteSettings.logoUrl}
      logoAlt={siteSettings.logoAlt}
      services={services.map((s: any) => ({ id: String(s.id), title: s.title, description: s.description }))}
      values={values.map((v: any) => ({ id: String(v.id), title: v.title, description: v.description }))}
      faqs={faqs.map((f: any) => ({ id: String(f.id), q: f.question, a: f.answer }))}
      team={[]}
      stats={stats.map((s: any) => ({ label: s.label ?? '', value: s.value ?? '' }))}
    />
  )
}