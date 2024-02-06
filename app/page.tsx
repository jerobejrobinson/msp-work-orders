import Link from "next/link"
import Image from "next/image"
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from "@/components/LogoutButton"
export const dynamic = 'force-dynamic'
export default async function Index() {
  const supabase = createServerComponentClient({ cookies })

  const { data: { user } } = await supabase.auth.getUser()

  const { data: admin  } = await supabase.from('admin').select('user_id, first_name').eq('user_id', user?.id).limit(1).single()

  return (
    <>
      <nav className="w-full flex border-b border-b-foreground/10 h-16 justify-center fixed z-50 top-0 bg-white">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 text-sm text-foreground">
          <Link href="/">
            <Image src="/images/clear-logo.png" width={200} height={100} alt="MSP Diesel Solution Logo" />
          </Link>
          <div className="flex flex-row items-center gap-4">
            {!user && (
              <Link href="/login" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover self-end" >Login</Link>
            )}
            {user && admin && (
              <>
                <Link href="/dashboard" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center">Dashboard</Link>
                <LogoutButton />
              </>
            )}
            {!admin && user && (
              <>
                <Link href="/work-orders" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center">Work Orders</Link>
                <Link href="/profile" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center">Profile</Link>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </nav>
      <div className=" h-main mt-16 flex flex-col lg:flex-row items-center justify-center lg:space-x-16 p-4">
        {/* max width 495 */}
        <div className="w-full max-w-xl space-y-8">
          <h1 className="text-4xl font-bold">Expert Fuel Injector and Pump Repair/Reman Services!</h1>
          <p className="font-sans">Welcome to MSP Diesel Solutions R&R Program, your one-stop shop for top-quality fuel injector and pump repair and re-manufacturing services. We understand the importance of a well-functioning engine, and our skilled technicians are dedicated to reviving your vehicle's performance with precision and care.</p>
          <div>
            <Link
              href="/login?sign-up=true"
              className="bg-main text-white rounded p-4"
            >Create Account To Get Started.</Link>
          </div>
          <p className="text-sm font-sans p-1"><em>We offer 3 turn-around on testing and work service. Sign up for a account to get started!</em></p>
        </div>
        <div className="w-full max-w-xl h-96 relative overflow-hidden">
          <Image
            src="/images/msp_office.jpg"
            alt="MSP Diesel Solutions Main Building"
            fill={true}
            className="object-contain"
          />
        </div>
      </div>
      <div className=" h-main mt-16 flex flex-row items-center justify-center flex-wrap">
        <h2 className="text-4xl font-bold basis-full text-center">How It Works</h2>
        <div className="w-full h-96 relative overflow-hidden max-w-2xl">
          <Image
            src="/images/msp_warehouse.jpg"
            alt="MSP Diesel Solutions Warehouse"
            fill={true}
            className="object-cover p-4"
          />
        </div>
        <div className="w-full max-w-xl space-y-4">
          <ol className="space-y-4">
            <li><strong>Work Order Submission</strong>: Submit a work order request online, from there we when send you a shipping with in 30 minutes.</li>
            <li><strong>Shiping Out</strong>: We will provide you with a shipping label to have your parts sent to our shop.</li>
            <li><strong>Testing</strong>: Our skilled technicians will conduct a thorough assessment to determine the best course of action.</li>
            <li><strong>Repair/Reman</strong>: We apply state-of-the-art techniques and replace worn parts to restore your fuel injectors and pumps to optimal conditions.</li>
            <li><strong>Delivered to Your Doorstep</strong>: Once complete, we promptly deliver your revitalized components, ready to breathe new life back into your vehicle.</li>
          </ol>
        </div>
        <div className="basis-full text-center">
          <p className="max-w-4xl mx-auto">Don't let engine troubles hold you back. <br /> Unlock the full potential of your engine with our expert fuel injector and pump remanufacturing services. <br />Join countless satisfied customers who have experienced the exceptional results we deliver.</p>
        </div>
      </div>
      <footer className="bg-[#1c1a33] text-white text-center p-4 mt-20">
        <p className="text-xl font-bold">Contact us now to discuss your needs and let our dedicated team get your engine roaring again!</p>
        <div className="flex flex-row w-full justify-between mt-16">
          <p>phone: <a href="tel:19013960710">(901) 396-0710</a></p>
          <p>email: <a href="mailto:mspfuelinjectionrepair@mspdieselsolutions.com">mspfuelinjectionrepair@mspdieselsolutions.com</a></p>
        </div>
      </footer>
    </>
  )
}
