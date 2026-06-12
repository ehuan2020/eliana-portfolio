'use client'
import { Project } from '@/lib/supabase'
import { useAdmin } from '@/contexts/AdminContext'
import { Edit2, Trash2, Star } from 'lucide-react'

interface Props {
  project: Project
  onClick: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function ProjectCard({ project, onClick, onEdit, onDelete }: Props) {
  const { isAdmin } = useAdmin()
  const hasMedia = project.cover_url || project.media?.length > 0

  return (
    <div
      className="scanline-hover"
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 0.25s, transform 0.25s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--gold-dim)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Cover image / placeholder */}
      <div style={{
        height: '220px',
        background: hasMedia && project.cover_url
          ? `url(${project.cover_url}) center/cover`
          : 'var(--surface-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        borderBottom: '1px solid var(--border)',
      }}>
        {!hasMedia && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }}>◻</div>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>NO MEDIA</p>
          </div>
        )}
        {project.featured && (
          <div style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            background: 'rgba(200,169,110,0.15)',
            border: '1px solid var(--gold-dim)',
            borderRadius: '3px', padding: '0.2rem 0.5rem',
            display: 'flex', alignItems: 'center', gap: '0.3rem',
          }}>
            <Star size={10} color="var(--gold)" fill="var(--gold)" />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '0.08em' }}>FEATURED</span>
          </div>
        )}

        {/* Admin controls */}
        {isAdmin && (
          <div style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem',
            display: 'flex', gap: '0.4rem',
          }} onClick={e => e.stopPropagation()}>
            <button onClick={onEdit} style={{
              background: 'rgba(13,13,15,0.85)', border: '1px solid var(--border-2)',
              borderRadius: '4px', padding: '0.35rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}>
              <Edit2 size={12} color="var(--text-muted)" />
            </button>
            <button onClick={onDelete} style={{
              background: 'rgba(13,13,15,0.85)', border: '1px solid var(--border-2)',
              borderRadius: '4px', padding: '0.35rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}>
              <Trash2 size={12} color="#ef4444" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <p style={{
            fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
            color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>{project.category}</p>
          <p style={{
            fontFamily: 'JetBrains Mono', fontSize: '0.6rem',
            color: 'var(--text-dim)', letterSpacing: '0.06em',
          }}>{project.media?.length || 0} files</p>
        </div>

        <h3 style={{
          fontFamily: 'Space Grotesk', fontWeight: 600,
          fontSize: '1.05rem', color: 'var(--text)',
          marginBottom: '0.6rem', lineHeight: 1.3,
        }}>{project.title}</h3>

        <p style={{
          fontFamily: 'Inter', fontWeight: 300, fontSize: '0.82rem',
          color: 'var(--text-muted)', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{project.description}</p>

        {project.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '1rem' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: 'JetBrains Mono', fontSize: '0.6rem',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: '3px', padding: '0.2rem 0.5rem',
                color: 'var(--text-dim)', letterSpacing: '0.06em',
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
