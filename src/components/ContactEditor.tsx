'use client'
import { useState } from 'react'
import { ContactContent, ContactLink, CONTACT_ID } from '@/lib/supabase'
import { X, Trash2, Plus } from 'lucide-react'

interface Props {
  contact: ContactContent
  onSave: (contact: ContactContent) => void
  onClose: () => void
}

export default function ContactEditor({ contact, onSave, onClose }: Props) {
  const [eyebrow, setEyebrow] = useState(contact.eyebrow)
  const [heading, setHeading] = useState(contact.heading)
  const [blurb, setBlurb] = useState(contact.blurb)
  const [links, setLinks] = useState<ContactLink[]>(contact.links.map(l => ({ ...l })))
  const [saving, setSaving] = useState(false)

  const supabaseConnected = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  const updateLink = (i: number, field: keyof ContactLink, value: string) =>
    setLinks(l => l.map((link, idx) => idx === i ? { ...link, [field]: value } : link))
  const addLink = () => setLinks(l => [...l, { label: '', value: '', href: '' }])
  const removeLink = (i: number) => setLinks(l => l.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    setSaving(true)

    const contactData: ContactContent = {
      id: CONTACT_ID,
      eyebrow: eyebrow.trim(),
      heading: heading.trim(),
      blurb: blurb.trim(),
      links: links.map(l => ({ label: l.label.trim(), value: l.value.trim(), href: l.href.trim() })).filter(l => l.label && l.href),
    }

    if (supabaseConnected) {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      })
      if (!res.ok) {
        const { error } = await res.json()
        alert('Save failed: ' + error)
        setSaving(false)
        return
      }
    }

    onSave(contactData)
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
  const rowStyle = {
    display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'center',
    background: 'var(--surface-2)', border: '1px solid var(--border)',
    borderRadius: '4px', padding: '0.75rem',
  }
  const iconButtonStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '3px', padding: '0.4rem',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
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
        borderRadius: '10px', width: '100%', maxWidth: '680px',
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
              EDIT GET IN TOUCH
            </p>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1.1rem' }}>
              Contact Section
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
            <label style={labelStyle}>Eyebrow</label>
            <input value={eyebrow} onChange={e => setEyebrow(e.target.value)} placeholder="Get in Touch" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Heading</label>
            <input value={heading} onChange={e => setHeading(e.target.value)} placeholder="Let's Work Together" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Blurb</label>
            <textarea value={blurb} onChange={e => setBlurb(e.target.value)}
              placeholder="Open to full-time roles in..."
              rows={3} style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }} />
          </div>

          <div>
            <label style={labelStyle}>Contact Links</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {links.map((link, i) => (
                <div key={i} style={rowStyle}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <input value={link.label} onChange={e => updateLink(i, 'label', e.target.value)}
                      placeholder="Label (e.g. Email)" style={{ ...inputStyle, fontSize: '0.8rem' }} />
                    <input value={link.value} onChange={e => updateLink(i, 'value', e.target.value)}
                      placeholder="Display text" style={{ ...inputStyle, fontSize: '0.8rem' }} />
                    <input value={link.href} onChange={e => updateLink(i, 'href', e.target.value)}
                      placeholder="URL / mailto:" style={{ ...inputStyle, fontSize: '0.8rem' }} />
                  </div>
                  <button onClick={() => removeLink(i)} style={iconButtonStyle}>
                    <Trash2 size={12} color="#ef4444" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addLink} style={{
              marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: '4px', padding: '0.5rem 0.8rem', color: 'var(--text-muted)', cursor: 'pointer',
            }}><Plus size={12} /> Add Link</button>
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
