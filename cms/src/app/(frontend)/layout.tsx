import React from 'react'
import './styles.css'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
})

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={dmSans.className}>
        <main>{children}</main>
      </body>
    </html>
  )
}