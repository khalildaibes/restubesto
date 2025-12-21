import type { Metadata } from 'next'
import { LanguageProvider } from '@/features/language/components/LanguageProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'מסעדת אלזיין - Restaurant Menu',
  description: 'Digital restaurant menu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
