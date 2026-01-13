import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CyberEffects from '@/components/CyberEffects'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VulnScanner - Security Vulnerability Scanner',
  description: 'Advanced threat detection and vulnerability analysis system',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CyberEffects />
        {children}
      </body>
    </html>
  )
}