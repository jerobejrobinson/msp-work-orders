import Image from 'next/image'
import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardLayout({ children, }: {children: React.ReactNode}) {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    const { data: admin  } = await supabase.from('admin').select('user_id, first_name').eq('user_id', user?.id).limit(1).single()
    if(!admin) {
        redirect('/')
    }
    return (
        <>
            <nav className="w-full flex border-b border-b-foreground/10 h-16 justify-center fixed z-50 top-0 bg-white">
                <div className="w-full max-w-7xl flex justify-between items-center p-3 text-sm text-foreground">
                    <Link href="/">
                        <Image src="/images/clear-logo.png" width={200} height={100} alt="MSP Diesel Solution Logo"/>
                    </Link>
                    <div className='flex flex-row items-center gap-4'>
                        <p>{admin.first_name}</p>
                        <Link href="/dashboard" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center">
                            Dashboard
                        </Link>
                        <Link href="/dashboard/work-order-status-board" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center">
                            Current Jobs
                        </Link>
                        <Link href="/dashboard/technicians" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center">
                            Technicians
                        </Link>
                        <LogoutButton />
                    </div>
                </div>
            </nav>
            {children}
        </>
    )
}