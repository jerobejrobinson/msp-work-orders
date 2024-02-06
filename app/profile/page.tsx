import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
export const dynamic = 'force-dynamic'
// import Metadata from 'next'

// export const metadata: Metadata = {
//   title: 'Profile | MSP Diesel Solutions Work Order Tracker'
// }
export default async function ProfileRoute() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser() 

    if(!user) {
      redirect('/login')
    }
    
    const { data: CustomerData } = await supabase.from('customer').select().eq('user_id', user.id).limit(1).single()

    if(!CustomerData) return <ProfileForm />
    
    return (
      <div className='p-20 bg-white rounded'>
        <p>{CustomerData.first_name} {CustomerData.last_name}</p>
        <p>{CustomerData.address}</p>
        <p>{CustomerData.phone}</p>
      </div>
    )
} 