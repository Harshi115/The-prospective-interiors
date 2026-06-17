# The Prospective Interiors — Official Website

A fully CMS-powered website for **The Prospective Interiors**, a Pune-based interior design firm established in 2004 and led by Principal Designer Prashant Bhandiya.

Built as part of Engineering Internship Assignment #02.

---

## Live Demo

| | URL |
|---|---|
| 🌐 Frontend | `https://the-prospective-interiors.vercel.app` |
| 🔧 Admin CMS | `https://the-prospective-interiors.vercel.app/admin` |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 15 (App Router) | Server Components, SSG + ISR for project pages |
| Language | TypeScript (strict) | Type safety across frontend and backend |
| CMS | Payload CMS 3 | Self-hosted, code-first, deeply integrated with Next.js |
| Database | PostgreSQL | Payload CMS native adapter |
| Styling | Inline CSS + DM font family | Full design control without Tailwind overhead |
| Animations | CSS transitions | Subtle, professional — no Framer Motion dependency |
| Deployment | Vercel | CI/CD, preview deployments, edge network |
| Images | Payload media uploads + Unsplash | CMS-managed with fallback placeholders |
| Validation | Zod | Runtime schema validation on POST /api/inquiries |

---

## Project Structure

```
cms/
├── src/
│   ├── app/
│   │   ├── (frontend)/          # All public-facing pages
│   │   │   ├── page.tsx         # Home page (server component)
│   │   │   ├── HomeClient.tsx   # Home interactive UI
│   │   │   ├── about/
│   │   │   │   ├── page.tsx
│   │   │   │   └── AboutClient.tsx
│   │   │   ├── contact/
│   │   │   │   ├── page.tsx
│   │   │   │   └── ContactClient.tsx
│   │   │   └── projects/
│   │   │       ├── page.tsx
│   │   │       ├── ProjectsClient.tsx
│   │   │       └── [slug]/
│   │   │           ├── page.tsx          # SSG + ISR project detail
│   │   │           └── ProjectDetailClient.tsx
│   │   └── api/
│   │       ├── projects/
│   │       │   ├── route.ts             # GET /api/projects
│   │       │   └── [slug]/route.ts      # GET /api/projects/:slug
│   │       ├── services/route.ts        # GET /api/services
│   │       ├── team/route.ts            # GET /api/team
│   │       └── inquiries/route.ts       # POST /api/inquiries (Zod validated)
│   ├── collections/
│   │   ├── Projects.ts
│   │   ├── Services.ts
│   │   ├── TeamMembers.ts
│   │   ├── Stats.ts
│   │   ├── Pages.ts
│   │   ├── Inquiries.ts
│   │   ├── Media.ts
│   │   └── Users.ts
│   └── payload.config.ts
├── .env.local
├── package.json
└── README.md
```

---

## CMS Collections (Data Models)

### Project
| Field | Type | Notes |
|---|---|---|
| title | text | Required |
| slug | text | URL-safe, unique |
| client | text | Client name |
| location | text | City, State |
| year | number | Completion year |
| sector | select | Hospitality / Industrial / Healthcare / Retail / Residential / Commercial / Civic |
| heroImage | upload | Main project image |
| gallery | upload (hasMany) | Additional project images |
| description | textarea | Project description |
| area | text | Square footage / area |
| featured | checkbox | Show on homepage |

### Service
| Field | Type | Notes |
|---|---|---|
| title | text | Service name |
| description | text | Short description |
| order | number | Display order |

### TeamMember
| Field | Type | Notes |
|---|---|---|
| name | text | Full name |
| role | text | Job title |
| photo | upload | Headshot |
| bio | text | Short biography |
| order | number | Display order |

### Stat
| Field | Type | Notes |
|---|---|---|
| label | text | e.g. "Years of Excellence" |
| value | text | e.g. "20+" |
| order | number | Display order |

### Page (Homepage)
| Field | Type | Notes |
|---|---|---|
| heroHeadline | text | Main hero heading |
| heroSubtext | text | Hero subheading |
| heroImage | upload | Hero background image |
| philosophyText | text | Philosophy quote |
| seoTitle | text | SEO page title |
| seoDescription | text | SEO meta description |

### Inquiry
| Field | Type | Notes |
|---|---|---|
| name | text | Submitter name |
| email | text | Zod email validated |
| phone | text | Optional |
| projectType | select | Residential / Commercial / Hospitality / Industrial / Healthcare / Retail / Educational / Other |
| message | text | Project description |
| submittedAt | date | Auto-set on submit |
| status | select | New / Contacted / Closed |

---

## API Endpoints

### GET /api/projects
Returns all published projects.

```bash
curl https://the-prospective-interiors.vercel.app/api/projects
```

**Response**
```json
{
  "docs": [
    {
      "id": "1",
      "title": "The Ritz-Carlton Residences",
      "slug": "the-ritz-carlton-residences",
      "client": "Ritz Carlton Pvt Ltd",
      "location": "Pune, Maharashtra",
      "year": 2025,
      "sector": "Hospitality",
      "heroImage": "/api/media/file/image.webp",
      "gallery": [],
      "description": "...",
      "featured": true
    }
  ],
  "totalDocs": 14
}
```

---

### GET /api/projects/:slug
Returns a single project by slug.

```bash
curl https://the-prospective-interiors.vercel.app/api/projects/the-ritz-carlton-residences
```

**Response**
```json
{
  "id": "1",
  "title": "The Ritz-Carlton Residences",
  "slug": "the-ritz-carlton-residences",
  "sector": "Hospitality",
  "description": "A landmark luxury residential project...",
  "gallery": ["/api/media/file/img1.webp", "/api/media/file/img2.webp"]
}
```

**404 Response**
```json
{
  "error": "Project not found",
  "status": 404
}
```

---

### GET /api/services
Returns all services ordered by `order` field.

```bash
curl https://the-prospective-interiors.vercel.app/api/services
```

**Response**
```json
{
  "docs": [
    { "id": "1", "title": "Conceptualization & Design", "description": "...", "order": 1 },
    { "id": "2", "title": "Project Management", "description": "...", "order": 2 }
  ]
}
```

---

### GET /api/team
Returns all team members ordered by `order` field.

```bash
curl https://the-prospective-interiors.vercel.app/api/team
```

**Response**
```json
{
  "docs": [
    { "id": "1", "name": "Prashant Bhandiya", "role": "Principal Designer", "bio": "...", "photo": "..." }
  ]
}
```

---

### POST /api/inquiries
Submits a project inquiry. Validated with Zod.

```bash
curl -X POST https://the-prospective-interiors.vercel.app/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+91 98765 43210",
    "projectType": "Residential",
    "message": "I want to redesign my 3BHK apartment in Baner, Pune. Budget around 30 lakhs."
  }'
```

**Success Response (201)**
```json
{
  "success": true,
  "message": "Inquiry submitted successfully",
  "id": "abc123"
}
```

**Validation Error Response (400)**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email address" },
    { "field": "name", "message": "Name is required" }
  ]
}
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or Neon/Supabase)

### 1 — Clone the repo
```bash
git clone https://github.com/your-username/the-prospective-interiors.git
cd the-prospective-interiors/cms
```

### 2 — Install dependencies
```bash
npm install
```

### 3 — Create `.env.local`
```bash
cp .env.example .env.local
```

Fill in the values (see Environment Variables below)

### 4 — Run development server
```bash
npm run dev
```

Open:
- Frontend → `http://localhost:3000`
- CMS Admin → `http://localhost:3000/admin`

### 5 — Create first admin user
Go to `http://localhost:3000/admin` and create your admin account.

### 6 — Seed the CMS
Add content in this order:
1. **Media** → Upload `logo.png` (firm logo — used across all pages)
2. **Stats** → 4 entries (20+ Years, 200+ Projects, 8 Sectors, 50+ Team)
3. **Services** → 12 entries (see list in CMS section above)
4. **Team Members** → Add Prashant Bhandiya
5. **Projects** → Real client projects + demo projects (14+ total)
6. **Pages** → Home page content + hero image + SEO fields

> **Logo Note:** After uploading `logo.png` to Media, it will automatically appear on all pages via `/api/media/file/logo.png`. In dark mode, the logo is automatically inverted to white using CSS filter.

---

## Environment Variables

```env
# Database
DATABASE_URI=postgresql://user:password@host:5432/dbname

# Payload CMS
PAYLOAD_SECRET=your-super-secret-key-min-32-chars

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### For Production (Vercel)
Add these in Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URI=postgresql://...neon.tech/dbname
PAYLOAD_SECRET=your-production-secret-key
NEXT_PUBLIC_SERVER_URL=https://your-vercel-url.vercel.app
```

---

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URI
vercel env add PAYLOAD_SECRET
vercel env add NEXT_PUBLIC_SERVER_URL
```

Or connect GitHub repo directly on vercel.com:
1. Import repository
2. Root directory: `cms`
3. Add environment variables
4. Deploy

---

## Pages Overview

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, stats, featured projects, philosophy |
| `/projects` | Projects | Filter grid, search, compare |
| `/projects/[slug]` | Project Detail | SSG + ISR, gallery, description |
| `/about` | About | Firm story, values, team, services, sectors |
| `/contact` | Contact | 3-step inquiry form |
| `/admin` | CMS Admin | Payload CMS dashboard |

---

## Features

- ✅ Full-bleed hero with CMS-managed content
- ✅ Filterable projects grid (8 sectors)
- ✅ Project detail pages with SSG + ISR
- ✅ Dark / Light theme toggle (localStorage)
- ✅ Compare 2 projects side by side
- ✅ 3-step contact form with Zod validation
- ✅ 12 services from CMS
- ✅ Team members from CMS
- ✅ Stats counter animation
- ✅ Image gallery with lightbox
- ✅ SEO metadata per page
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ REST API endpoints

---

## Known Limitations

- Tailwind CSS not used — inline CSS used instead for full design control
- Framer Motion not used — CSS transitions used (acceptable per assignment)
- Hono backend not used — Next.js API routes used instead (simpler for monorepo setup)
- Image optimization uses Payload's built-in handler, not Sharp separately

---

## Assignment Requirements Status

| Req | Description | Status |
|---|---|---|
| R1 | Full-Bleed Hero | ✅ Done |
| R2 | Filterable Projects Grid | ✅ Done |
| R3 | Project Detail (SSG + ISR) | ✅ Done |
| R4 | All Content via CMS | ✅ Done |
| R5 | Services Section (12) | ✅ Done |
| R6 | Dark/Light Theme | ✅ Done |
| R7 | Contact Form | ✅ Done |
| R8 | REST API | ✅ Done |
| R9 | Responsive Design | ✅ Done |
| R10 | Seed Real Projects (14) | ✅ Done |
| R11 | Compare Projects | ✅ Done |
| R12 | Animations | ✅ Done |
| R13 | SEO Metadata | ✅ Done |

---

## Author

Built by **Harshita** as part of Engineering Internship Assignment #02 — June 2026

**The Prospective Interiors** — Est. 2004 · Pune, Maharashtra
