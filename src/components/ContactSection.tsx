'use client'
import { useState, useEffect } from 'react'
import { ContactContent, supabase, CONTACT_ID } from '@/lib/supabase'
import { DEFAULT_CONTACT } from '@/lib/demo-data'
import { useAdmin } from '@/contexts/AdminContext'
import ContactEditor from './ContactEditor'
import { Edit2 } from 'lucide-react'

export default function ContactSection() {
  const { isAdmin } = useAdmin()
  const [contact, setContact] = useState<ContactContent>(DEFAULT_CONTACT)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const fetchContact = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .eq('id', CONTACT_ID)
        .maybeSingle()
      if (!error && data) setContact(data)
    }
    fetchContact()
  }, [])

  return (
    <section id="contact" style={{ padding: '6rem 2.5rem', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {contact.eyebrow}
          </p>
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
        <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          {contact.heading}
        </h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          {contact.blurb}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '360px', margin: '0 auto' }}>
          {contact.links.map(link => (
            <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: '5px', padding: '0.85rem 1.1rem', textDecoration: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.background = 'var(--surface)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-2)' }}
            >
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{link.label}</span>
              <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{link.value}</span>
            </a>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
          © {new Date().getFullYear()} · Eliana Huang · Technical Artist
        </p>
      </div>

      {editing && (
        <ContactEditor
          contact={contact}
          onSave={updated => { setContact(updated); setEditing(false) }}
          onClose={() => setEditing(false)}
        />
      )}
    </section>
  )
}
