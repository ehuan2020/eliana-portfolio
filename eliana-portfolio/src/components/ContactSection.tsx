'use client'
export default function ContactSection() {
  const links = [
    { label: 'Email', value: 'hello@elianahuang.site', href: 'mailto:hello@elianahuang.site' },
    { label: 'LinkedIn', value: 'linkedin.com/in/elianahuang', href: 'https://linkedin.com/in/elianahuang' },
    { label: 'Portfolio', value: 'elianahuang.site', href: 'https://elianahuang.site' },
  ]

  return (
    <section id="contact" style={{ padding: '6rem 2.5rem', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Get in Touch
        </p>
        <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          Let's Work Together
        </h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Open to full-time roles in Technical Art, Animation Pipeline, and Tools Development. Also happy to chat about your project.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '360px', margin: '0 auto' }}>
          {links.map(link => (
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
    </section>
  )
}
