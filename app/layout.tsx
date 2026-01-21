import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PDFTextExtractor',
  description: 'PDF 파일에서 텍스트를 추출하는 프로그램',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

