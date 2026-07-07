# 🏛️ The Prospective Interiors — Official Website

> A fully CMS-powered luxury interior design website built with **Next.js 15** + **Strapi v5**

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Strapi](https://img.shields.io/badge/Strapi-v5-2F2D5B?style=flat-square&logo=strapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

---

## 🌐 Live Links

| | Link |
|--|------|
| 🚀 **Live Website** | https://the-prospective-interiors.vercel.app |
| ⚙️ **CMS Admin** | https://lovely-passion-679d98f6f1.strapiapp.com/admin |
| 📦 **GitHub Repo** | https://github.com/Harshi115/The-prospective-interiors |

---

## ✨ Features

- 🌙 **Dark / Light Mode** — saved in localStorage
- 🗂️ **Sector Filters** — filter projects by 8 sectors
- 🖼️ **Project Gallery** — lightbox with keyboard navigation
- ⚖️ **Project Compare** — compare 2 projects side by side
- 📬 **Contact Form** — saves to Strapi CMS
- 📱 **Fully Responsive** — mobile, tablet, desktop
- 🔍 **SEO Ready** — dynamic metadata from CMS
- ⚡ **CMS Powered** — all content managed via Strapi, no hardcoding

---

## 🏗️ Tech Stack

| Layer | Technology | Why? |
|-------|-----------|------|
| 🎨 Frontend | Next.js 15 (App Router) | Server components, fast, Vercel integration |
| 📝 CMS | Strapi v5 | Headless CMS, REST API, easy content management |
| 🔷 Language | TypeScript | Type safety, better developer experience |
| 🗄️ Database | SQLite | Simple setup, no separate DB server needed |
| 🚀 Hosting | Vercel + Strapi Cloud | Best platforms for Next.js and Strapi |

---

## 📁 Project Structure

```
The-prospective-interiors/
│
├── 📂 cms/                          ← Next.js 15 Frontend
│   ├── src/
│   │   └── app/
│   │       ├── api/inquiries/       ← Contact form API route
│   │       └── (frontend)/
│   │           ├── page.tsx         ← Home page
│   │           ├── homeclient.tsx
│   │           ├── projects/        ← Projects listing + detail
│   │           ├── about/           ← About page
│   │           └── contact/         ← Contact page
│   └── public/
│
└── 📂 strapi/                       ← Strapi v5 CMS
    └── src/api/
        ├── project/
        ├── service/
        ├── stat/
        ├── page/
        ├── inquiry/
        └── team-member/
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm
- Git

### 1️⃣ Clone the repo
```bash
git clone https://github.com/Harshi115/The-prospective-interiors.git
cd The-prospective-interiors
```

### 2️⃣ Start Strapi CMS
```bash
cd strapi
npm install
npm run develop
```
> Strapi → `http://localhost:1337` | Admin → `http://localhost:1337/admin`

### 3️⃣ Start Next.js Frontend
```bash
cd ../cms
npm install
npm run dev
```
> Frontend → `http://localhost:3000`

### 4️⃣ Environment Variables

Create `cms/.env`:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=
```

### 5️⃣ Strapi Permissions
1. Go to `http://localhost:1337/admin`
2. **Settings** → **Users & Permissions** → **Roles** → **Public**
3. Enable `find` + `findOne` for: Project, Service, Stat, Page, Team Member
4. Enable `create` for: Inquiry
5. **Save** ✅

---

## 🔑 Environment Variables

### Frontend (`cms/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi CMS URL | `http://localhost:1337` |
| `STRAPI_API_TOKEN` | Strapi API token (optional) | `abc123...` |

### Strapi (`strapi/.env`)

| Variable | Description |
|----------|-------------|
| `HOST` | Server host (`0.0.0.0`) |
| `PORT` | Server port (`1337`) |
| `APP_KEYS` | App keys (`key1,key2,key3,key4`) |
| `API_TOKEN_SALT` | Random string |
| `ADMIN_JWT_SECRET` | Random string |
| `JWT_SECRET` | Random string |
| `NODE_ENV` | `development` or `production` |

---

## 🔌 API Reference

### Strapi APIs
> Base URL: `https://lovely-passion-679d98f6f1.strapiapp.com`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects?populate=heroImage,gallery` | All projects |
| `GET` | `/api/projects?filters[featured][$eq]=true` | Featured projects |
| `GET` | `/api/projects?filters[slug][$eq]={slug}` | Single project |
| `GET` | `/api/projects?filters[sector][$eq]={sector}` | By sector |
| `GET` | `/api/stats?sort=order:asc` | All stats |
| `GET` | `/api/services?sort=order:asc` | All services |
| `GET` | `/api/pages?populate=heroImage` | Page content |
| `POST` | `/api/inquiries` | Submit inquiry |

### Next.js API Routes
> Base URL: `https://the-prospective-interiors.vercel.app`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/inquiries` | Submit contact form |

**📬 POST /api/inquiries — Sample payload:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "phone": "9876543210",
  "message": "I want to redesign my office in Pune with modern sustainable design."
}
```

**✅ Response:**
```json
{
  "success": true,
  "id": "123"
}
```

---

## 🗄️ CMS Collections

| Collection | Key Fields |
|-----------|-----------|
| 📁 **Project** | title, slug, client, location, year, sector, heroImage, gallery, description, area, featured |
| 🛠️ **Service** | title, description, order |
| 📊 **Stat** | label, value, order |
| 👤 **Team Member** | name, role, photo, bio, order |
| 📄 **Page** | heroHeadline, heroSubtext, heroImage, philosophyText, seoTitle, seoDescription |
| 📬 **Inquiry** | name, email, phone, message |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| 🟡 Gold | `#b89a6e` |
| 🟤 Cream | `#f7f4ef` |
| ⚫ Dark | `#1a1814` |
| 🔤 Heading Font | Cormorant Garamond |
| 🔤 Body Font | Inter |

---

## 🌍 Deployment Guide

### Frontend → Vercel
1. Connect GitHub repo
2. **Root Directory:** `cms`
3. Add env variable: `NEXT_PUBLIC_STRAPI_URL`
4. Deploy! 🚀

### CMS → Strapi Cloud
1. Create separate repo for `strapi` folder
2. Connect to Strapi Cloud
3. Region: Asia (Southeast) · Node: 18
4. Add all env variables
5. Deploy! 🚀

---

## ⚠️ Known Limitations

- 🗄️ **SQLite** — data may reset on Strapi Cloud restarts. PostgreSQL recommended for production
- 🖼️ **Base64 Images** — some fallback images embedded in code. Should use CDN in production
- 🔒 **No Auth** — CMS is public read. API token recommended for production
- 💅 **Inline Styles** — used for rapid development. CSS modules/Tailwind better for scale
- 🌿 **Single Branch** — developed on main. Feature branches recommended for team projects

---

## 👩‍💻 Developer

**Harshita** — Junior Software Developer  
📍 Triaksha Automations, Jaipur  
🏛️ Internship project for **The Prospective Interiors**, Pune — Est. 2004

---

## 📄 License
Private project — © 2026 The Prospective Interiors. All rights reserved.
