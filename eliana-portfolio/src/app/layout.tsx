import type { Metadata } from 'next'
import './globals.css'
import { AdminProvider } from '@/contexts/AdminContext'

export const metadata: Metadata = {
  title: 'Eliana Huang — Technical Artist',
  description: 'Portfolio of Eliana Huang, Technical Artist and Animator. Pipelines, shaders, rigs, and tools.',
  openGraph: {
    title: 'Eliana Huang — Technical Artist',
    description: 'Building the bridge between art and engineering.',
    url: 'https://elianahuang.site',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  )
}
