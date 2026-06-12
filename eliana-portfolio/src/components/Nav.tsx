'use client'
import { useState, useEffect } from 'react'
import { useAdmin } from '@/contexts/AdminContext'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const { isAdmin, login, logout } = useAdmin()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(password)) {
      setShowLogin(false)
      setPassword('')
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0 2rem',
        height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(13,13,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <a href="#" style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: 'var(--text)',
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}>
          Eliana Huang
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {['Work', 'About', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >{item}</a>
          ))}

          {isAdmin ? (
            <button onClick={logout} style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              background: 'rgba(200,169,110,0.12)',
              border: '1px solid var(--gold-dim)',
              color: 'var(--gold)',
              padding: '0.25rem 0.75rem',
              borderRadius: '3px',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>Admin ✓</button>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-dim)', fontSize: '0.65rem',
              fontFamily: 'JetBrains Mono, monospace',
            }}>···</button>
          )}
        </div>
      </nav>

      {showLogin && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowLogin(false)}>
          <form onSubmit={handleLogin} onClick={e => e.stopPropagation()} style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '2rem',
            width: '320px',
            display: 'flex', flexDirection: 'column', gap: '1rem',
          }}>
            <p style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1rem' }}>Admin Access</p>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              placeholder="Password"
              autoFocus
              style={{
                background: 'var(--surface)', border: `1px solid ${error ? '#ef4444' : 'var(--border)'}`,
                borderRadius: '4px', padding: '0.6rem 0.8rem',
                color: 'var(--text)', fontFamily: 'Inter', fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            {error && <p style={{ color: '#ef4444', fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}>Incorrect password</p>}
            <button type="submit" style={{
              background: 'var(--gold)', color: '#0D0D0F',
              border: 'none', borderRadius: '4px',
              padding: '0.6rem', fontFamily: 'Space Grotesk', fontWeight: 600,
              fontSize: '0.875rem', cursor: 'pointer',
            }}>Enter</button>
          </form>
        </div>
      )}
    </>
  )
}
