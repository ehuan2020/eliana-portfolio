'use client'
import { useState } from 'react'
import { HeroContent, HERO_ID } from '@/lib/supabase'
import { X } from 'lucide-react'

interface Props {
  hero: HeroContent
  onSave: (hero: HeroContent) => void
  onClose: () => void
}

export default function HeroEditor({ hero, onSave, onClose }: Props) {
  const [eyebrow, setEyebrow] = useState(hero.eyebrow)
  const [nameFirst, setNameFirst] = useState(hero.name_first)
  const [nameLast, setNameLast] = useState(hero.name_last)
  const [blurb, setBlurb] = useState(hero.blurb)
  const [saving, setSaving] = useState(false)

  const supabaseConnected = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  const handleSave = async () => {
    setSaving(true)

    const heroData: HeroContent = {
      id: HERO_ID,
      eyebrow: eyebrow.trim(),
      name_first: nameFirst.trim(),
      name_last: nameLast.trim(),
      blurb: blurb.trim(),
    }

    if (supabaseConnected) {
      const res = await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData),
      })
      if (!res.ok) {
        const { error } = await res.json()
        alert('Save failed: ' + error)
        setSaving(false)
        return
      }
    }

    onSave(heroData)
    setSaving(false)
  }

  const inputStyle = {
    background: 'var(--surface-2)', border: '1px solid var(--border)',
    borderRadius: '4px', padding: '0.6rem 0.8rem',
    color: 'var(--text)', fontFamily: 'Inter', fontSize: '0.875rem',
    outline: 'none', width: '100%',
  }
  const labelStyle = {
    fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
    color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' as const,
    marginBottom: '0.4rem', display: 'block',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', width: '100%', maxWidth: '620px',
        maxHeight: '90vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1,
        }}>
          <div>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.12em', marginBottom: '0.2rem' }}>
              EDIT INTRO
            </p>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1.1rem' }}>
              Hero Section
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: '4px', padding: '0.4rem', cursor: 'pointer',
          }}><X size={14} color="var(--text-muted)" /></button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Eyebrow — role tagline</label>
            <input value={eyebrow} onChange={e => setEyebrow(e.target.value)}
              placeholder="Technical Artist · Animator · Tools Developer" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input value={nameFirst} onChange={e => setNameFirst(e.target.value)} placeholder="Eliana" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input value={nameLast} onChange={e => setNameLast(e.target.value)} placeholder="Huang" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Blurb</label>
            <textarea value={blurb} onChange={e => setBlurb(e.target.value)}
              placeholder="Building the bridge between art and engineering..."
              rows={4} style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
          position: 'sticky', bottom: 0, background: 'var(--surface)',
        }}>
          <button onClick={onClose} style={{
            fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: '0.875rem',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: '4px', padding: '0.6rem 1.25rem',
            color: 'var(--text-muted)', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.875rem',
            background: saving ? 'var(--gold-dim)' : 'var(--gold)',
            color: '#0D0D0F', border: 'none',
            borderRadius: '4px', padding: '0.6rem 1.25rem',
            cursor: saving ? 'wait' : 'pointer',
          }}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  )
}
