'use client'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setTimeout(() => setMounted(true), 100) }, [])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '0 2.5rem 5rem',
      position: 'relative',
    }}>
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
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.72rem',
          color: 'var(--gold)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: '1.25rem',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(8px)',
          transition: 'all 0.7s ease 0.2s',
        }}>Technical Artist · Animator · Tools Developer</p>

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
          Eliana<br />
          <span style={{ color: 'var(--gold)' }}>Huang</span>
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
          Building the bridge between art and engineering — 
          pipelines, shaders, rigs, and tools that let creative teams move faster.
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
    </section>
  )
}
