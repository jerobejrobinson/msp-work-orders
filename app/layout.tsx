import './globals.css'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '../components/LogoutButton'
import Image from 'next/image'
import { Roboto_Slab } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import { Router } from 'next/router'
export const metadata = {
  title: 'MSP Fuel Injection Systems Repair/Reman',
  description: `Welcome to MSP Diesel Solutions' Fuel Injector and Pump Repair & Remanufacturing Program – your premier destination for high-quality fuel system restoration services. Our team recognizes the vital role a properly functioning engine plays, and our expert technicians are committed to enhancing your vehicle's performance with meticulous attention and expertise. Explore our comprehensive solutions today!`,
}

const inter = Roboto_Slab({
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({ children, }: {children: React.ReactNode}) {
  const supabase = createServerComponentClient({ cookies })

  const { data: { user } } = await supabase.auth.getUser()

  const { data: admin  } = await supabase.from('admin').select('user_id, first_name').eq('user_id', user?.id).limit(1).single()

  return (
    <html lang="en"  className={inter.className}>
      <body>
      {children}
      <Analytics />
      </body>
    </html>
  )
}
