'use client'
export default function AboutSection() {
  const skills = [
    { label: 'DCC', items: ['Maya', 'Houdini', 'Blender', 'MotionBuilder'] },
    { label: 'Engines', items: ['Unreal Engine 5', 'Unity'] },
    { label: 'Languages', items: ['Python', 'HLSL', 'GDScript', 'C#'] },
    { label: 'Specialties', items: ['Rigging', 'Niagara VFX', 'Pipeline TD', 'Technical Shaders'] },
  ]

  return (
    <section id="about" style={{ padding: '6rem 2.5rem', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>About</p>
          <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', lineHeight: 1.1, marginBottom: '1.75rem' }}>
            Art × Engineering
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              "I'm a Technical Artist and Animator completed my Master's at CMU's Entertainment Technology Center. I've shipped production work at EA Motive Studio across two co-op terms, building rigging pipelines, VFX systems, and tools that let artists focus on what matters.",
              "My work lives at the intersection of art and code — I write Python pipelines in Maya, craft HLSL shaders in UE5, and build editor tools that make creative teams faster.",
              "Currently building Moyu Office, a networking platform for game developers."
            ].map((p, i) => (
              <p key={i} style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{p}</p>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Toolset</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {skills.map(group => (
              <div key={group.label}>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  {group.label}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {group.items.map(item => (
                    <span key={item} style={{
                      fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 400,
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: '4px', padding: '0.3rem 0.7rem', color: 'var(--text-muted)',
                    }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Experience</p>
            {[
              { role: 'Technical Artist Co-op', company: 'EA Motive Studio', period: '2024' },
              { role: 'Technical Animator Co-op', company: 'EA Motive Studio', period: '2023' },
              { role: "Master's — ETC", company: 'Carnegie Mellon University', period: '2024–2026' },
            ].map(e => (
              <div key={e.role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <div>
                  <p style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text)' }}>{e.role}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>{e.company}</p>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-dim)' }}>{e.period}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
