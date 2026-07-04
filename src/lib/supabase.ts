import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
)

export type MediaType = 'image' | 'video' | 'pdf'

export interface MediaItem {
  id: string
  url: string
  type: MediaType
  caption?: string
  thumbnail?: string
}

export interface Project {
  id: string
  slug: string
  title: string
  category: string
  tags: string[]
  description: string
  writeup: string
  cover_url: string
  media: MediaItem[]
  featured: boolean
  order_index: number
  created_at: string
}

export const CATEGORIES = ['All', 'Technical Art', 'Animation', 'Tools', 'VFX', 'Pipeline', 'Game Dev', 'Environment Art', 'Other']

export interface SkillGroup {
  label: string
  items: string[]
}

export interface ExperienceEntry {
  role: string
  company: string
  period: string
}

export interface AboutContent {
  id: string
  heading: string
  bio: string[]
  skills: SkillGroup[]
  experience: ExperienceEntry[]
}

export const ABOUT_ID = 'main'
