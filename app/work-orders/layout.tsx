import Image from 'next/image'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardLayout({ children, }: {children: React.ReactNode}) {
    return (
        <>
            <nav className="w-full flex border-b border-b-foreground/10 h-16 justify-center fixed z-50 top-0 bg-white">
                <div className="w-full max-w-7xl flex justify-between items-center p-3 text-sm text-foreground">
                    <Link href="/" >
                        <Image src="/images/clear-logo.png" width={200} height={100} alt="MSP Diesel Solution Logo" />
                    </Link>
                    <div className='flex flex-row items-center gap-4'>
                    <Link href="/work-orders" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center">Work Orders</Link>
                    <Link href="/profile" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center">Profile</Link>
                    <LogoutButton />
                    </div>
                </div>
            </nav>
            {children}
        </>
    )
}