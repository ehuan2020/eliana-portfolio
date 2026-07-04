'use client'
import { useState } from 'react'
import { AboutContent, SkillGroup, ExperienceEntry, supabase, ABOUT_ID } from '@/lib/supabase'
import { X, Trash2, Plus } from 'lucide-react'

interface Props {
  about: AboutContent
  onSave: (about: AboutContent) => void
  onClose: () => void
}

export default function AboutEditor({ about, onSave, onClose }: Props) {
  const [heading, setHeading] = useState(about.heading)
  const [bio, setBio] = useState(about.bio.join('\n\n'))
  const [skills, setSkills] = useState<SkillGroup[]>(about.skills.map(s => ({ ...s })))
  const [skillDrafts, setSkillDrafts] = useState<string[]>(about.skills.map(() => ''))
  const [experience, setExperience] = useState<ExperienceEntry[]>(about.experience.map(e => ({ ...e })))
  const [saving, setSaving] = useState(false)

  const supabaseConnected = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  const updateSkillLabel = (i: number, label: string) =>
    setSkills(s => s.map((g, idx) => idx === i ? { ...g, label } : g))
  const addSkillGroup = () => {
    setSkills(s => [...s, { label: '', items: [] }])
    setSkillDrafts(d => [...d, ''])
  }
  const removeSkillGroup = (i: number) => {
    setSkills(s => s.filter((_, idx) => idx !== i))
    setSkillDrafts(d => d.filter((_, idx) => idx !== i))
  }

  const setSkillDraft = (i: number, value: string) =>
    setSkillDrafts(d => d.map((v, idx) => idx === i ? value : v))
  const addSkillItem = (i: number) => {
    const value = skillDrafts[i]?.trim()
    if (!value) return
    setSkills(s => s.map((g, idx) => idx === i && !g.items.includes(value) ? { ...g, items: [...g.items, value] } : g))
    setSkillDraft(i, '')
  }
  const removeSkillItem = (i: number, item: string) =>
    setSkills(s => s.map((g, idx) => idx === i ? { ...g, items: g.items.filter(x => x !== item) } : g))

  const updateExperience = (i: number, field: keyof ExperienceEntry, value: string) =>
    setExperience(e => e.map((entry, idx) => idx === i ? { ...entry, [field]: value } : entry))
  const addExperience = () => setExperience(e => [...e, { role: '', company: '', period: '' }])
  const removeExperience = (i: number) => setExperience(e => e.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    setSaving(true)

    const aboutData: AboutContent = {
      id: ABOUT_ID,
      heading: heading.trim(),
      bio: bio.split('\n\n').map(p => p.trim()).filter(Boolean),
      skills: skills.map(g => ({ label: g.label.trim(), items: g.items })).filter(g => g.label),
      experience: experience.map(e => ({ role: e.role.trim(), company: e.company.trim(), period: e.period.trim() })).filter(e => e.role),
    }

    if (supabaseConnected) {
      const { error } = await supabase.from('about').upsert(aboutData)
      if (error) { alert('Save failed: ' + error.message); setSaving(false); return }
    }

    onSave(aboutData)
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
              EDIT ABOUT
            </p>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1.1rem' }}>
              About Section
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: '4px', padding: '0.4rem', cursor: 'pointer',
          }}><X size={14} color="var(--text-muted)" /></button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Heading */}
          <div>
            <label style={labelStyle}>Heading</label>
            <input value={heading} onChange={e => setHeading(e.target.value)} placeholder="Art × Engineering" style={inputStyle} />
          </div>

          {/* Bio */}
          <div>
            <label style={labelStyle}>Bio — one paragraph per blank line</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)}
              placeholder={"First paragraph...\n\nSecond paragraph..."}
              rows={8} style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }} />
          </div>

          {/* Skills */}
          <div>
            <label style={labelStyle}>Toolset — Skill Groups</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {skills.map((g, i) => (
                <div key={i} style={rowStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <input value={g.label} onChange={e => updateSkillLabel(i, e.target.value)}
                      placeholder="Group label (e.g. DCC)" style={{ ...inputStyle, fontSize: '0.8rem' }} />

                    {g.items.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {g.items.map(item => (
                          <span key={item} style={{
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            fontFamily: 'Inter', fontSize: '0.8rem',
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: '4px', padding: '0.25rem 0.4rem 0.25rem 0.7rem', color: 'var(--text-muted)',
                          }}>
                            {item}
                            <button onClick={() => removeSkillItem(i, item)} style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              padding: '0.1rem', display: 'flex', alignItems: 'center',
                            }}><X size={11} color="var(--text-dim)" /></button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <input value={skillDrafts[i] || ''}
                        onChange={e => setSkillDraft(i, e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkillItem(i) } }}
                        placeholder="Add a skill and press Enter"
                        style={{ ...inputStyle, fontSize: '0.8rem' }} />
                      <button onClick={() => addSkillItem(i)} style={iconButtonStyle}>
                        <Plus size={12} color="var(--text-muted)" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeSkillGroup(i)} style={iconButtonStyle}>
                    <Trash2 size={12} color="#ef4444" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addSkillGroup} style={{
              marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: '4px', padding: '0.5rem 0.8rem', color: 'var(--text-muted)', cursor: 'pointer',
            }}><Plus size={12} /> Add Group</button>
          </div>

          {/* Experience */}
          <div>
            <label style={labelStyle}>Experience</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {experience.map((e, i) => (
                <div key={i} style={rowStyle}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem' }}>
                    <input value={e.role} onChange={ev => updateExperience(i, 'role', ev.target.value)}
                      placeholder="Role" style={{ ...inputStyle, fontSize: '0.8rem' }} />
                    <input value={e.company} onChange={ev => updateExperience(i, 'company', ev.target.value)}
                      placeholder="Company" style={{ ...inputStyle, fontSize: '0.8rem' }} />
                    <input value={e.period} onChange={ev => updateExperience(i, 'period', ev.target.value)}
                      placeholder="Period" style={{ ...inputStyle, fontSize: '0.8rem' }} />
                  </div>
                  <button onClick={() => removeExperience(i)} style={iconButtonStyle}>
                    <Trash2 size={12} color="#ef4444" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addExperience} style={{
              marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: '4px', padding: '0.5rem 0.8rem', color: 'var(--text-muted)', cursor: 'pointer',
            }}><Plus size={12} /> Add Entry</button>
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
