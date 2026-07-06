'use client'
import { useEffect, useState } from 'react'
import { Project, supabase } from './supabase'
import { DEMO_PROJECTS } from './demo-data'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { setLoaded(true); return }
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true })
      if (!error && data?.length) setProjects(data)
      setLoaded(true)
    }
    fetchProjects()
  }, [])

  return { projects, setProjects, loaded }
}
