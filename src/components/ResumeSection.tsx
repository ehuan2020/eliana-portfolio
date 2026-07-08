'use client'
import { useState, useEffect, useRef } from 'react'
import { ResumeContent, supabase, RESUME_ID } from '@/lib/supabase'
import { DEFAULT_RESUME } from '@/lib/demo-data'
import { useAdmin } from '@/contexts/AdminContext'
import { Download, Upload, FileText } from 'lucide-react'

export default function ResumeSection() {
  const { isAdmin } = useAdmin()
  const [resume, setResume] = useState<ResumeContent>(DEFAULT_RESUME)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabaseConnected = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  useEffect(() => {
    const fetchResume = async () => {
      if (!supabaseConnected) return
      const { data, error } = await supabase
        .from('resume')
        .select('*')
        .eq('id', RESUME_ID)
        .maybeSingle()
      if (!error && data) setResume(data)
    }
    fetchResume()
  }, [supabaseConnected])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return
    if (!supabaseConnected) { alert('Connect Supabase to enable resume uploads. See README for setup instructions.'); return }

    setUploading(true)

    const path = `resume/resume.pdf`
    const body = new FormData()
    body.append('file', file)
    body.append('path', path)
    const uploadRes = await fetch('/api/upload', { method: 'POST', body })
    if (!uploadRes.ok) {
      const { error } = await uploadRes.json()
      alert('Upload failed: ' + error)
      setUploading(false)
      return
    }
    const { publicUrl } = await uploadRes.json()

    const resumeData: ResumeContent = {
      id: RESUME_ID,
      url: `${publicUrl}?v=${Date.now()}`, // cache-bust so the new file shows up immediately
      filename: file.name,
      updated_at: new Date().toISOString(),
    }

    const saveRes = await fetch('/api/resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resumeData),
    })
    if (!saveRes.ok) {
      const { error } = await saveRes.json()
      alert('Save failed: ' + error)
      setUploading(false)
      return
    }

    setResume(resumeData)
    setUploading(false)
  }

  const updatedLabel = resume.updated_at
    ? new Date(resume.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <section id="resume" style={{ padding: '6rem 2.5rem', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Resume
        </p>
        <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          Download My Resume
        </h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          {resume.url
            ? 'Always up to date — grab the latest version below.'
            : 'Resume coming soon.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          {resume.url && (
            <a
              href={resume.url}
              download
              target="_blank"
              rel="noopener"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: '0.9rem',
                background: 'var(--gold)', color: '#0D0D0F',
                padding: '0.8rem 1.75rem', borderRadius: '5px', textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-bright)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}
            >
              <Download size={16} /> Download Resume
            </a>
          )}

          {resume.url && (
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
              {resume.filename}{updatedLabel ? ` · updated ${updatedLabel}` : ''}
            </p>
          )}

          {isAdmin && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: '4px', padding: '0.6rem 1rem',
                  color: 'var(--text-muted)', cursor: uploading ? 'wait' : 'pointer',
                  marginTop: '0.5rem',
                }}
              >
                {uploading ? <FileText size={14} /> : <Upload size={14} />}
                {uploading ? 'Uploading...' : resume.url ? 'Replace Resume (PDF)' : 'Upload Resume (PDF)'}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
