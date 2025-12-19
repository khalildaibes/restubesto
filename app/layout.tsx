import type { Metadata } from 'next'
import { LanguageProvider } from '@/features/language/components/LanguageProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sushi-na - Restaurant Menu',
  description: 'Digital restaurant menu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
