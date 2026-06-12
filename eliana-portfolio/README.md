# Eliana Huang — Portfolio

A clean, fast portfolio for Technical Artists. Built with Next.js 15, deployed on Vercel, powered by Supabase for media storage.

---

## Quick Start (local)

```bash
npm install
npm run dev
# → http://localhost:3000
```

Works immediately with demo projects. No Supabase needed to browse locally.

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variables (see below)
4. Deploy

---

## Connect Supabase (for real content + uploads)

### 1. Create a Supabase project at [supabase.com](https://supabase.com)

### 2. Run this SQL in the Supabase SQL Editor:

```sql
-- Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null default 'Technical Art',
  tags text[] default '{}',
  description text default '',
  writeup text default '',
  cover_url text default '',
  media jsonb default '[]',
  featured boolean default false,
  order_index integer default 999,
  created_at timestamptz default now()
);

-- Enable public read
alter table projects enable row level security;
create policy "Public read" on projects for select using (true);
create policy "Admin write" on projects for all using (true);

-- Storage bucket for media
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true);
create policy "Public read" on storage.objects for select using (bucket_id = 'portfolio');
create policy "Authenticated upload" on storage.objects for insert with check (bucket_id = 'portfolio');
```

### 3. Add environment variables

In Vercel project settings → Environment Variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Your chosen admin password |

Also update `.env.local` for local dev.

---

## Adding Your Work (Admin Mode)

1. Open your portfolio site
2. Click the `···` button in the top-right nav
3. Enter your admin password
4. Click **Add Project** or the edit/delete icons on cards

### In the editor:
- **Drag & drop** images (JPG, PNG, WebP), videos (MP4, MOV), or PDFs directly onto the upload zone
- Set any image as the **cover** with the COVER button
- Write your **writeup** in Markdown — `## Heading`, `**bold**`, `- bullet`
- Toggle **Featured** to highlight key projects
- Hit **Save Changes**

---

## Customization

### Update your info
- `src/components/Hero.tsx` — Name, tagline, bio
- `src/components/AboutSection.tsx` — Skills, experience, bio text
- `src/components/ContactSection.tsx` — Email, LinkedIn, links
- `src/app/layout.tsx` — SEO title/description

### Colors
All in `src/app/globals.css` under `:root`:
```css
--gold: #C8A96E;     /* accent */
--bg: #0D0D0F;       /* background */
--text: #F0EDE8;     /* text */
```

### Categories
Edit `CATEGORIES` in `src/lib/supabase.ts`.

---

## Stack

- **Next.js 15** (App Router)
- **Supabase** (Postgres + Storage)
- **react-dropzone** (file uploads)
- **lucide-react** (icons)
- **Vercel** (hosting)
