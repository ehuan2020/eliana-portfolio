'use client'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import WorkSection from '@/components/WorkSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WorkSection />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  )
}
