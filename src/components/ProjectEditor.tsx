'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Project, MediaItem, MediaType, CATEGORIES } from '@/lib/supabase'
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube'
import { X, Upload, GripVertical, Trash2, Plus, Video } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  project?: Project
  onSave: (project: Project) => void
  onClose: () => void
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function ProjectEditor({ project, onSave, onClose }: Props) {
  const isNew = !project?.id
  const [title, setTitle] = useState(project?.title || '')
  const [category, setCategory] = useState(project?.category || 'Technical Art')
  const [tags, setTags] = useState((project?.tags || []).join(', '))
  const [description, setDescription] = useState(project?.description || '')
  const [writeup, setWriteup] = useState(project?.writeup || '')
  const [featured, setFeatured] = useState(project?.featured || false)
  const [media, setMedia] = useState<MediaItem[]>(project?.media || [])
  const [coverUrl, setCoverUrl] = useState(project?.cover_url || '')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [saving, setSaving] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const supabaseConnected = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!supabaseConnected) {
      alert('Connect Supabase to enable file uploads. See README for setup instructions.')
      return
    }
    setUploading(true)
    const newMedia: MediaItem[] = []

    for (const file of acceptedFiles) {
      setUploadProgress(`Uploading ${file.name}...`)
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      const type: MediaType = file.type.startsWith('video') ? 'video'
        : ext === 'pdf' ? 'pdf' : 'image'

      const path = `projects/${slugify(title || 'untitled')}/${uuidv4()}.${ext}`
      const body = new FormData()
      body.append('file', file)
      body.append('path', path)
      const res = await fetch('/api/upload', { method: 'POST', body })

      if (res.ok) {
        const { publicUrl } = await res.json()
        newMedia.push({ id: uuidv4(), url: publicUrl, type, caption: file.name.replace(`.${ext}`, '') })
        if (type === 'image' && !coverUrl) setCoverUrl(publicUrl)
      }
    }

    setMedia(prev => [...prev, ...newMedia])
    setUploading(false)
    setUploadProgress('')
  }, [title, coverUrl, supabaseConnected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov'],
      'application/pdf': ['.pdf'],
    },
  })

  const handleSave = async () => {
    if (!title.trim()) { alert('Title is required'); return }
    setSaving(true)

    const projectData: Project = {
      id: project?.id || uuidv4(),
      slug: slugify(title),
      title: title.trim(),
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      description: description.trim(),
      writeup: writeup.trim(),
      cover_url: coverUrl,
      media,
      featured,
      order_index: project?.order_index ?? 999,
      created_at: project?.created_at || new Date().toISOString(),
    }

    if (supabaseConnected) {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })
      if (!res.ok) {
        const { error } = await res.json()
        alert('Save failed: ' + error)
        setSaving(false)
        return
      }
    }

    onSave(projectData)
    setSaving(false)
  }

  const removeMedia = (id: string) => setMedia(m => m.filter(x => x.id !== id))
  const updateCaption = (id: string, caption: string) =>
    setMedia(m => m.map(x => x.id === id ? { ...x, caption } : x))

  const addYoutubeLink = () => {
    const id = getYouTubeId(youtubeUrl.trim())
    if (!id) { alert('That doesn\'t look like a valid YouTube URL'); return }
    setMedia(prev => [...prev, { id: uuidv4(), url: `https://www.youtube.com/watch?v=${id}`, type: 'youtube', caption: '' }])
    setYoutubeUrl('')
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
        borderRadius: '10px', width: '100%', maxWidth: '780px',
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
              {isNew ? 'NEW PROJECT' : 'EDIT PROJECT'}
            </p>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1.1rem' }}>
              {title || 'Untitled'}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: '4px', padding: '0.4rem', cursor: 'pointer',
          }}><X size={14} color="var(--text-muted)" /></button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title + Category row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Project Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Project" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Python, Maya, UE5" style={inputStyle} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Short Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="One or two sentences shown on the card."
              rows={2} style={{ ...inputStyle, resize: 'vertical' as const }} />
          </div>

          {/* Media dropzone */}
          <div>
            <label style={labelStyle}>Media — Images, Videos, PDFs, YouTube Links</label>
            <div {...getRootProps()} style={{
              border: `1.5px dashed ${isDragActive ? 'var(--gold)' : 'var(--border-2)'}`,
              borderRadius: '6px', padding: '2rem',
              textAlign: 'center', cursor: 'pointer',
              background: isDragActive ? 'rgba(200,169,110,0.04)' : 'var(--surface-2)',
              transition: 'all 0.2s',
            }}>
              <input {...getInputProps()} />
              <Upload size={24} color={isDragActive ? 'var(--gold)' : 'var(--text-dim)'} style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: isDragActive ? 'var(--gold)' : 'var(--text-muted)' }}>
                {uploading ? uploadProgress : isDragActive ? 'Drop to upload' : 'Drag & drop images, videos, or PDFs here'}
              </p>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '0.4rem', letterSpacing: '0.08em' }}>
                {supabaseConnected ? 'JPG · PNG · MP4 · MOV · PDF' : 'CONNECT SUPABASE TO ENABLE UPLOADS'}
              </p>
            </div>

            {/* YouTube link */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <input
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addYoutubeLink() } }}
                placeholder="Paste a YouTube link — plays embedded on the site"
                style={{ ...inputStyle, fontSize: '0.8rem' }}
              />
              <button onClick={addYoutubeLink} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0,
                fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: '4px', padding: '0 0.9rem', color: 'var(--text-muted)', cursor: 'pointer',
              }}>
                <Video size={14} /> Add
              </button>
            </div>

            {/* Media list */}
            {media.length > 0 && (
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {media.map((m, i) => (
                  <div key={m.id} style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr auto',
                    gap: '0.75rem', alignItems: 'center',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: '4px', padding: '0.6rem 0.75rem',
                  }}>
                    {m.type === 'image' ? (
                      <img src={m.url} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '3px' }} alt="" />
                    ) : m.type === 'youtube' ? (
                      <img
                        src={getYouTubeThumbnail(getYouTubeId(m.url) || '')}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '3px' }}
                        alt=""
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: 'var(--surface)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.6rem', fontFamily: 'JetBrains Mono', color: 'var(--gold)', letterSpacing: '0.05em' }}>{m.type.toUpperCase()}</span>
                      </div>
                    )}
                    <input
                      value={m.caption || ''}
                      onChange={e => updateCaption(m.id, e.target.value)}
                      placeholder="Caption (optional)"
                      style={{ ...inputStyle, padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                    />
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {m.type !== 'youtube' && (
                        <button onClick={() => setCoverUrl(m.url)} title="Set as cover" style={{
                          background: m.url === coverUrl ? 'rgba(200,169,110,0.2)' : 'var(--surface)',
                          border: `1px solid ${m.url === coverUrl ? 'var(--gold-dim)' : 'var(--border)'}`,
                          borderRadius: '3px', padding: '0.3rem 0.5rem',
                          cursor: 'pointer', fontSize: '0.6rem', fontFamily: 'JetBrains Mono',
                          color: m.url === coverUrl ? 'var(--gold)' : 'var(--text-dim)',
                          letterSpacing: '0.06em',
                        }}>COVER</button>
                      )}
                      <button onClick={() => removeMedia(m.id)} style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: '3px', padding: '0.3rem',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                      }}><Trash2 size={12} color="#ef4444" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Writeup */}
          <div>
            <label style={labelStyle}>Writeup — Markdown supported</label>
            <textarea value={writeup} onChange={e => setWriteup(e.target.value)}
              placeholder={`## Overview\n\nDescribe what you built and why.\n\n## Technical Approach\n\nExplain the interesting technical decisions.\n\n## Results\n\n- Bullet one\n- Bullet two`}
              rows={12} style={{ ...inputStyle, resize: 'vertical' as const, fontFamily: 'JetBrains Mono', fontSize: '0.8rem', lineHeight: 1.6 }} />
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '0.4rem', letterSpacing: '0.06em' }}>
              ## Heading · **bold** · - bullet
            </p>
          </div>

          {/* Featured toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <div onClick={() => setFeatured(f => !f)} style={{
              width: '36px', height: '20px', borderRadius: '10px',
              background: featured ? 'var(--gold)' : 'var(--surface-2)',
              border: '1px solid var(--border)', position: 'relative', transition: 'background 0.2s',
              cursor: 'pointer',
            }}>
              <div style={{
                position: 'absolute', top: '2px',
                left: featured ? '18px' : '2px',
                width: '14px', height: '14px', borderRadius: '50%',
                background: featured ? '#0D0D0F' : 'var(--text-dim)',
                transition: 'left 0.2s',
              }} />
            </div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>FEATURED PROJECT</span>
          </label>
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
          }}>{saving ? 'Saving...' : isNew ? 'Add Project' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  )
}
