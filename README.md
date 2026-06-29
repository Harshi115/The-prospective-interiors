# The Prospective Interiors — Official Website

A fully CMS-powered luxury interior design website built with **Next.js 15** + **Strapi v5**.

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router, TypeScript) |
| CMS | Strapi v5 (SQLite) |
| Styling | Inline styles (no CSS framework) |
| Fonts | Cormorant Garamond + Inter (Google Fonts) |
| Deployment | Vercel (Frontend) + Strapi Cloud (CMS) |

---

## 📁 Project Structure

```
The-prospective-interiors/
├── cms/                          ← Next.js 15 Frontend
│   ├── src/
│   │   └── app/
│   │       └── (frontend)/
│   │           ├── page.tsx              ← Home page
│   │           ├── homeclient.tsx        ← Home client component
│   │           ├── projects/
│   │           │   ├── page.tsx          ← Projects listing
│   │           │   ├── ProjectsClient.tsx
│   │           │   └── [slug]/
│   │           │       ├── page.tsx      ← Project detail
│   │           │       └── ProjectDetailClient.tsx
│   │           ├── about/
│   │           │   ├── page.tsx
│   │           │   └── AboutClient.tsx
│   │           └── contact/
│   │               ├── page.tsx
│   │               └── contactclient.tsx
│   └── .env                      ← Environment variables
└── strapi/                       ← Strapi v5 CMS
    ├── src/
    │   └── api/                  ← Collection types
    ├── config/
    └── database/
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- npm

### Step 1 — Clone the repo
```bash
git clone https://github.com/Harshi115/The-prospective-interiors.git
cd The-prospective-interiors
```

### Step 2 — Start Strapi CMS
```bash
cd strapi
npm install
npm run develop
```
Strapi runs at: `http://localhost:1337`
Admin panel: `http://localhost:1337/admin`

### Step 3 — Start Next.js Frontend
```bash
cd ../cms
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`

### Step 4 — Environment Variables
Create `cms/.env`:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=
```

---

## 🗄 Strapi CMS Collections

| Collection | Fields |
|-----------|--------|
| **Project** | title, slug, client, location, year, sector, heroImage, gallery, description, area, featured |
| **Service** | title, description, icon, order |
| **Stat** | label, value, order |
| **Team Member** | name, role, photo, bio, order |
| **Page** | heroHeadline, heroSubtext, heroImage, philosophyText, seoTitle, seoDescription |
| **Inquiry** | name, email, phone, project_type, message, submittedAt, status |

---

## 🌐 Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://the-prospective-interiors.vercel.app |
| CMS (Strapi Cloud) | https://lovely-passion-679d98f6f1.strapiapp.com |

### Deploy Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Root Directory: `cms`
3. Environment Variables:
   ```
   NEXT_PUBLIC_STRAPI_URL=https://lovely-passion-679d98f6f1.strapiapp.com
   ```

### Deploy CMS (Strapi Cloud)
1. Connect `tpi-strapi` GitHub repo to Strapi Cloud
2. Region: Asia (Southeast)
3. Node version: 18

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Gold | `#b89a6e` |
| Cream | `#f7f4ef` |
| Dark | `#1a1814` |
| Heading Font | Cormorant Garamond |
| Body Font | Inter |

---

## ✨ Features

- ✅ **Dark/Light Mode** — persisted in localStorage
- ✅ **CMS-powered** — all content from Strapi
- ✅ **Project Gallery** — lightbox with keyboard navigation
- ✅ **Project Compare** — side-by-side comparison
- ✅ **Contact Form** — saves to Strapi Inquiry collection
- ✅ **Responsive** — mobile, tablet, desktop
- ✅ **SEO** — dynamic metadata from CMS
- ✅ **Sector Filters** — filter projects by sector
- ✅ **Related Projects** — same sector suggestions

---

## 👩‍💻 Developer

Harshita & Kuber

---

## 📄 License

Private project — All rights reserved © 2026 The Prospective Interiors
