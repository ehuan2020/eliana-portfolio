'use client'
import { useState, useEffect } from 'react'
import { AboutContent, supabase, ABOUT_ID } from '@/lib/supabase'
import { DEFAULT_ABOUT } from '@/lib/demo-data'
import { useAdmin } from '@/contexts/AdminContext'
import { useIsMobile } from '@/lib/useIsMobile'
import AboutEditor from './AboutEditor'
import { Edit2 } from 'lucide-react'

export default function AboutSection() {
  const { isAdmin } = useAdmin()
  const isMobile = useIsMobile()
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const fetchAbout = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .eq('id', ABOUT_ID)
        .maybeSingle()
      if (!error && data) setAbout(data)
    }
    fetchAbout()
  }, [])

  return (
    <section id="about" style={{ padding: '6rem 2.5rem', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '3rem' : '5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>About</p>
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
          <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', lineHeight: 1.1, marginBottom: '1.75rem' }}>
            {about.heading}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {about.bio.map((p, i) => (
              <p key={i} style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{p}</p>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Toolset</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {about.skills.map(group => (
              <div key={group.label}>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  {group.label}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {group.items.map(item => (
                    <span key={item} style={{
                      fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 400,
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: '4px', padding: '0.3rem 0.7rem', color: 'var(--text-muted)',
                    }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Experience</p>
            {about.experience.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <div>
                  <p style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text)' }}>{e.role}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>{e.company}</p>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-dim)' }}>{e.period}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editing && (
        <AboutEditor
          about={about}
          onSave={updated => { setAbout(updated); setEditing(false) }}
          onClose={() => setEditing(false)}
        />
      )}
    </section>
  )
}
