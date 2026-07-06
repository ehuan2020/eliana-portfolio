'use client'
import { useState, useEffect } from 'react'
import { Project, CATEGORIES, supabase } from '@/lib/supabase'
import { DEMO_PROJECTS } from '@/lib/demo-data'
import { useAdmin } from '@/contexts/AdminContext'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import ProjectEditor from './ProjectEditor'
import { Plus } from 'lucide-react'

export default function WorkSection() {
  const { isAdmin } = useAdmin()
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS)
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const [editing, setEditing] = useState<Project | null | 'new'>(null)
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

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  const handleSave = (updated: Project) => {
    setProjects(prev => {
      const exists = prev.find(p => p.id === updated.id)
      return exists ? prev.map(p => p.id === updated.id ? updated : p) : [updated, ...prev]
    })
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) { alert('Delete failed'); return }
    }
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const cats = CATEGORIES.filter(c => c === 'All' || projects.some(p => p.category === c))

  return (
    <section id="work" style={{ padding: '6rem 2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Section header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Selected Work
          </p>
          <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1 }}>
            Projects
          </h2>
        </div>
        {isAdmin && (
          <button onClick={() => setEditing('new')} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: '0.85rem',
            background: 'var(--gold)', color: '#0D0D0F',
            border: 'none', borderRadius: '4px', padding: '0.6rem 1.1rem',
            cursor: 'pointer',
          }}>
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {cats.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '0.35rem 0.85rem', borderRadius: '3px',
            cursor: 'pointer', transition: 'all 0.2s',
            background: filter === cat ? 'var(--gold)' : 'var(--surface-2)',
            border: `1px solid ${filter === cat ? 'var(--gold)' : 'var(--border)'}`,
            color: filter === cat ? '#0D0D0F' : 'var(--text-muted)',
          }}>{cat}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.25rem',
      }}>
        {filtered.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelected(project)}
            onEdit={() => setEditing(project)}
            onDelete={() => handleDelete(project.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', letterSpacing: '0.1em' }}>No projects yet</p>
          </div>
        )}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      {editing && (
        <ProjectEditor
          project={editing === 'new' ? undefined : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  )
}
