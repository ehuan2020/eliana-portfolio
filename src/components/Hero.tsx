'use client'
import { useEffect, useState } from 'react'
import { Project, HeroContent, supabase, HERO_ID } from '@/lib/supabase'
import { DEFAULT_HERO } from '@/lib/demo-data'
import { useProjects } from '@/lib/useProjects'
import { useAdmin } from '@/contexts/AdminContext'
import HeroEditor from './HeroEditor'
import { Edit2 } from 'lucide-react'

const TILE_W = 280
const TILE_H = 180
// marginRight instead of flex gap so total width = N * (TILE_W + TILE_GAP), making -50% a perfect half-set boundary
const TILE_GAP = 12

// 6 copies → 3 copies per half → translateX(-50%) resets exactly at the start of a copy
function buildTrack(projects: Project[]): Project[] {
  const track: Project[] = []
  for (let i = 0; i < 6; i++) track.push(...projects)
  return track
}

function GalleryTile({ project }: { project: Project }) {
  return (
    <div style={{
      width: TILE_W,
      height: TILE_H,
      flexShrink: 0,
      marginRight: TILE_GAP,
      borderRadius: '4px',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      position: 'relative',
    }}>
      {project.cover_url ? (
        <img
          src={project.cover_url}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: [
              'linear-gradient(var(--border) 1px, transparent 1px)',
              'linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '40px 40px',
            opacity: 0.35,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '0.75rem',
            background: 'linear-gradient(to top, rgba(13,13,15,0.95) 0%, transparent 100%)',
          }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.5rem',
              color: 'var(--gold)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '0.2rem',
            }}>{project.category}</p>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              color: 'var(--text-dim)',
              lineHeight: 1.2,
            }}>{project.title}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default function Hero() {
  const { isAdmin } = useAdmin()
  const { projects } = useProjects()
  const [mounted, setMounted] = useState(false)
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO)
  const [editing, setEditing] = useState(false)

  const covered = projects.filter(p => p.cover_url)
  const galleryProjects = covered.length > 0 ? covered : projects

  useEffect(() => { setTimeout(() => setMounted(true), 100) }, [])

  useEffect(() => {
    const fetchHero = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return
      const { data, error } = await supabase
        .from('hero')
        .select('*')
        .eq('id', HERO_ID)
        .maybeSingle()
      if (!error && data) setHero(data)
    }
    fetchHero()
  }, [])

  const row1 = buildTrack(galleryProjects)
  const row2 = buildTrack(galleryProjects)

  return (
    <section style={{
      display: 'flex', flexDirection: 'column',
      padding: '9rem 2.5rem 4rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Scrolling gallery */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', gap: TILE_GAP,
        pointerEvents: 'none',
      }}>
        {/* Row 1 — left */}
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            width: 'max-content',
            willChange: 'transform',
            animation: 'gallery-scroll-left 30s linear infinite',
          }}>
            {row1.map((p, i) => <GalleryTile key={i} project={p} />)}
          </div>
        </div>

        {/* Row 2 — right */}
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            width: 'max-content',
            willChange: 'transform',
            animation: 'gallery-scroll-right 36s linear infinite',
          }}>
            {row2.map((p, i) => <GalleryTile key={i} project={p} />)}
          </div>
        </div>

        {/* Vertical gradient — dark at bottom (text area) and top, lighter in middle */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom,
            rgba(13,13,15,0.92) 0%,
            rgba(13,13,15,0.18) 22%,
            rgba(13,13,15,0.18) 52%,
            rgba(13,13,15,0.90) 70%,
            rgba(13,13,15,1)    82%
          )`,
        }} />

        {/* Horizontal vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to right,
            rgba(13,13,15,1)    0%,
            rgba(13,13,15,0)   10%,
            rgba(13,13,15,0)   90%,
            rgba(13,13,15,1)  100%
          )`,
        }} />
      </div>

      {/* Ambient grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        opacity: 0.18,
        maskImage: 'radial-gradient(ellipse 80% 60% at 20% 80%, black 0%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 20% 80%, black 0%, transparent 80%)',
      }} />

      {/* Gold accent line */}
      <div style={{
        position: 'absolute', left: '2.5rem', top: '30%',
        width: '1px', height: mounted ? '120px' : '0px',
        background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)',
        transition: 'height 1.2s cubic-bezier(0.16,1,0.3,1) 0.4s',
      }} />

      <div style={{ position: 'relative', maxWidth: '900px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.72rem',
            color: 'var(--gold)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(8px)',
            transition: 'all 0.7s ease 0.2s',
          }}>{hero.eyebrow}</p>
          {isAdmin && (
            <button onClick={() => setEditing(true)} style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: '4px', padding: '0.35rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}>
              <Edit2 size={12} color="var(--text-muted)" />
            </button>
          )}
        </div>

        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(3rem, 8vw, 6.5rem)',
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(20px)',
          transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s',
          marginBottom: '1.75rem',
        }}>
          {hero.name_first}<br />
          <span style={{ color: 'var(--gold)' }}>{hero.name_last}</span>
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          color: 'var(--text-muted)',
          maxWidth: '520px',
          lineHeight: 1.7,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(12px)',
          transition: 'all 0.9s ease 0.4s',
        }}>
          {hero.blurb}
        </p>

        <div style={{
          display: 'flex', gap: '1rem', marginTop: '2.5rem',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.9s ease 0.6s',
        }}>
          <a href="#work" style={{
            fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: '0.875rem',
            background: 'var(--gold)', color: '#0D0D0F',
            padding: '0.7rem 1.5rem', borderRadius: '4px', textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-bright)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}
          >View Work</a>
          <a href="#contact" style={{
            fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: '0.875rem',
            background: 'transparent', color: 'var(--text)',
            padding: '0.7rem 1.5rem', borderRadius: '4px', textDecoration: 'none',
            border: '1px solid var(--border-2)',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold-dim)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-2)')}
          >Get in Touch</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2rem', right: '2.5rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        opacity: mounted ? 0.5 : 0, transition: 'opacity 1s ease 1.2s',
      }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.1em', writingMode: 'vertical-rl' }}>scroll</p>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--text-dim), transparent)' }} />
      </div>

      {editing && (
        <HeroEditor
          hero={hero}
          onSave={updated => { setHero(updated); setEditing(false) }}
          onClose={() => setEditing(false)}
        />
      )}
    </section>
  )
}
