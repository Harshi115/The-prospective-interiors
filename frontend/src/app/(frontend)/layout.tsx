import React from 'react'
import './styles.css'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
})

export const metadata = {
  title: {
    default: 'The Prospective Interiors | Luxury Interior Design',
    template: '%s | The Prospective Interiors',
  },
  description: 'The Prospective Interiors — bespoke luxury interior design studio crafting timeless residential and commercial spaces.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={`${dmSans.className} ${dmSerif.variable}`}>
        <main>{children}</main>
      </body>
    </html>
  )
}