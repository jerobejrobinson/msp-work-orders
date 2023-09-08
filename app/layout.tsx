import './globals.css'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '../components/LogoutButton'
import Image from 'next/image'
import { Roboto_Slab } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';

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
        <nav className="w-full flex border-b border-b-foreground/10 h-16 justify-center fixed z-50 top-0 bg-white">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 text-sm text-foreground">
            {!admin && user && (
              <>
                <Link
                  href="/"
                >
                  <Image 
                    src="/images/clear-logo.png"
                    width={200}
                    height={100}
                    alt="MSP Diesel Solution Logo"
                  />
                </Link>
                <div className='flex flex-row items-center gap-4'>
                  <Link
                    href="/work-orders"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                  >
                    Work Orders
                  </Link>
                  <Link
                    href="/profile"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                  >
                    Profile
                  </Link>
                  <LogoutButton />
                </div>
              </>
            )}
            {!admin && !user && (
              <>
              <Link
                href="/"
              >
                <Image 
                  src="/images/clear-logo.png"
                  width={200}
                  height={100}
                  alt="MSP Diesel Solution Logo"
                />
              </Link>
              <Link
                href="/login"
                className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover self-end"
              >
                Login
              </Link>
              </>
            )}
            {admin && user && (
              <>
                <Link
                  href="/"
                >
                  <Image 
                    src="/images/clear-logo.png"
                    width={200}
                    height={100}
                    alt="MSP Diesel Solution Logo"
                  />
                </Link>
                <div className='flex flex-row items-center gap-4'>
                <p>{admin.first_name}</p>
                  <Link
                    href="/dashboard"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                  >
                    Dashboard
                  </Link>
                  <LogoutButton />
                </div>
              </>
            )}
          </div>
      </nav>
      {children}
      <Analytics />
      </body>
    </html>
  )
}
