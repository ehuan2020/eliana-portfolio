'use client'
import { useState, useEffect } from 'react'
import { Project } from '@/lib/supabase'
import { X, ChevronLeft, ChevronRight, FileText } from 'lucide-react'

interface Props {
  project: Project
  onClose: () => void
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2 style="font-family:Space Grotesk,sans-serif;font-size:1.1rem;font-weight:600;color:var(--text);margin:1.5rem 0 0.6rem">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-family:Space Grotesk,sans-serif;font-size:0.95rem;font-weight:500;color:var(--text-muted);margin:1.2rem 0 0.5rem">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text);font-weight:600">$1</strong>')
    .replace(/^- (.+)$/gm, '<li style="margin:0.3rem 0;padding-left:0.5rem;color:var(--text-muted)">$1</li>')
    .replace(/(<li[^]*?<\/li>)/g, '<ul style="list-style:none;margin:0.6rem 0;border-left:2px solid var(--gold-dim);padding-left:1rem">$1</ul>')
    .replace(/\n\n/g, '</p><p style="margin:0.75rem 0;color:var(--text-muted);font-weight:300;line-height:1.7">')
    .replace(/^(?!<)(.+)$/gm, '<p style="margin:0.75rem 0;color:var(--text-muted);font-weight:300;line-height:1.7">$1</p>')
}

export default function ProjectModal({ project, onClose }: Props) {
  const [mediaIndex, setMediaIndex] = useState(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setMediaIndex(i => Math.min(i + 1, (project.media?.length || 1) - 1))
      if (e.key === 'ArrowLeft') setMediaIndex(i => Math.max(i - 1, 0))
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, project.media?.length])

  const media = project.media || []
  const currentMedia = media[mediaIndex]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          width: '100%', maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', // header stays put; body scrolls
        }}
      >
        {/* Sticky close + title header */}
        <div style={{
          flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '2rem 2rem 1.25rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {project.category}
            </p>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '2rem', lineHeight: 1.2 }}>
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: '4px', padding: '0.4rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', flexShrink: 0,
            }}
          >
            <X size={16} color="var(--text-muted)" />
          </button>
        </div>

        {/* Scrollable body — description, then photos, then writeup */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '1.75rem 2rem 2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* 1. Short description */}
            <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              {project.description}
            </p>

            {project.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
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

            {/* 2. Photos / media viewer */}
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}>
              {/* Main viewer */}
              <div style={{
                height: '420px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {media.length === 0 && (
                  <div style={{ textAlign: 'center', opacity: 0.3 }}>
                    <div style={{ fontSize: '3rem' }}>◻</div>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.5rem', letterSpacing: '0.1em' }}>NO MEDIA</p>
                  </div>
                )}
                {currentMedia?.type === 'image' && (
                  <img
                    src={currentMedia.url}
                    alt={currentMedia.caption || project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1.25rem' }}
                  />
                )}
                {currentMedia?.type === 'video' && (
                  <video
                    src={currentMedia.url}
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
                {currentMedia?.type === 'pdf' && (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
                    <FileText size={48} color="var(--gold-dim)" />
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{currentMedia.caption || 'Document'}</p>
                    <a href={currentMedia.url} target="_blank" rel="noopener" style={{
                      fontFamily: 'Space Grotesk', fontSize: '0.8rem', fontWeight: 500,
                      background: 'var(--gold)', color: '#0D0D0F',
                      padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none',
                    }}>Open PDF</a>
                  </div>
                )}

                {/* Prev / Next arrows */}
                {media.length > 1 && (
                  <>
                    <button
                      onClick={() => setMediaIndex(i => Math.max(i - 1, 0))}
                      style={{
                        position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(13,13,15,0.85)', border: '1px solid var(--border)',
                        borderRadius: '5px', padding: '0.5rem', cursor: 'pointer',
                        opacity: mediaIndex === 0 ? 0.25 : 1, transition: 'opacity 0.15s',
                      }}
                    >
                      <ChevronLeft size={20} color="var(--text)" />
                    </button>
                    <button
                      onClick={() => setMediaIndex(i => Math.min(i + 1, media.length - 1))}
                      style={{
                        position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(13,13,15,0.85)', border: '1px solid var(--border)',
                        borderRadius: '5px', padding: '0.5rem', cursor: 'pointer',
                        opacity: mediaIndex === media.length - 1 ? 0.25 : 1, transition: 'opacity 0.15s',
                      }}
                    >
                      <ChevronRight size={20} color="var(--text)" />
                    </button>

                    {/* Index counter */}
                    <div style={{
                      position: 'absolute', bottom: '0.75rem', right: '0.75rem',
                      background: 'rgba(13,13,15,0.8)', border: '1px solid var(--border)',
                      borderRadius: '3px', padding: '0.2rem 0.5rem',
                    }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                        {mediaIndex + 1} / {media.length}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip — horizontally scrollable */}
              {media.length > 1 && (
                <div style={{
                  flexShrink: 0,
                  display: 'flex', gap: '0.5rem',
                  padding: '0.75rem',
                  borderTop: '1px solid var(--border)',
                  overflowX: 'auto',
                }}>
                  {media.map((m, i) => (
                    <button
                      key={m.id}
                      onClick={() => setMediaIndex(i)}
                      style={{
                        width: '80px', height: '60px', flexShrink: 0,
                        background: m.type === 'image' ? `url(${m.url}) center/cover` : 'var(--surface)',
                        border: `2px solid ${i === mediaIndex ? 'var(--gold)' : 'var(--border)'}`,
                        borderRadius: '4px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'border-color 0.15s',
                        outline: 'none',
                      }}
                    >
                      {m.type !== 'image' && (
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: 'var(--gold)', letterSpacing: '0.06em' }}>
                          {m.type.toUpperCase()}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Caption bar */}
              {currentMedia?.caption && (
                <p style={{
                  flexShrink: 0,
                  fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-dim)',
                  padding: '0.5rem 0.75rem', borderTop: '1px solid var(--border)',
                  letterSpacing: '0.05em',
                }}>{currentMedia.caption}</p>
              )}
            </div>

            {/* 3. Writeup */}
            {project.writeup && (
              <div
                style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', fontFamily: 'Inter', fontSize: '0.85rem' }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(project.writeup) }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
