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

-- Public read only — writes go through the server (service role key),
-- never directly from the browser's anon key.
alter table projects enable row level security;
create policy "Public read" on projects for select using (true);

-- Storage bucket for media
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true);
create policy "Public read" on storage.objects for select using (bucket_id = 'portfolio');

-- About section (single row, editable in Admin Mode)
create table about (
  id text primary key,
  heading text not null default '',
  bio text[] default '{}',
  skills jsonb default '[]',
  experience jsonb default '[]'
);

alter table about enable row level security;
create policy "Public read" on about for select using (true);

-- Hero / intro section (single row, editable in Admin Mode)
create table hero (
  id text primary key,
  eyebrow text not null default '',
  name_first text not null default '',
  name_last text not null default '',
  blurb text not null default ''
);

alter table hero enable row level security;
create policy "Public read" on hero for select using (true);

-- Contact / "Get in Touch" section (single row, editable in Admin Mode)
create table contact (
  id text primary key,
  eyebrow text not null default '',
  heading text not null default '',
  blurb text not null default '',
  links jsonb default '[]'
);

alter table contact enable row level security;
create policy "Public read" on contact for select using (true);
```

> Note: there are deliberately no write policies here. Admin writes go
> through Next.js API routes (`src/app/api/**`) using the Supabase
> **service role key**, which bypasses RLS. The anon key shipped to the
> browser can only ever read.

### 3. Add environment variables

In Vercel project settings → Environment Variables:

| Variable | Value | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon (public) key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase **service_role** key (Settings → API) | **No — server only** |
| `ADMIN_PASSWORD` | Your chosen admin password | **No — server only** |

Also update `.env.local` for local dev. `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSWORD` must **not** have the `NEXT_PUBLIC_` prefix — that prefix tells Next.js to bundle the value into client-side JavaScript, which would defeat the point of keeping them secret.

---

## Adding Your Work (Admin Mode)

1. Open your portfolio site
2. Click the `···` button in the top-right nav
3. Enter your admin password (verified server-side; a session cookie authorizes edits, the password itself never touches the client bundle)
4. Click **Add Project** or the edit/delete icons on cards
5. Click the pencil icon next to any section label — **Intro**, **About**, or **Get in Touch** — to edit its content

### In the project editor:
- **Drag & drop** images (JPG, PNG, WebP), videos (MP4, MOV), or PDFs directly onto the upload zone
- Set any image as the **cover** with the COVER button
- Write your **writeup** in Markdown — `## Heading`, `**bold**`, `- bullet`
- Toggle **Featured** to highlight key projects
- Hit **Save Changes**

### In the About editor:
- Edit the **heading** and **bio** (separate paragraphs with a blank line)
- Add/remove **skills** within a group, or add/remove whole **skill groups**
- Add/remove **experience** entries — role, company, and period
- Hit **Save Changes**

### In the Intro editor:
- Edit the **eyebrow** tagline, **first/last name**, and **blurb**
- Hit **Save Changes**

### In the Get in Touch editor:
- Edit the **eyebrow**, **heading**, and **blurb**
- Add/remove **contact links** — label, display text, and URL
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
