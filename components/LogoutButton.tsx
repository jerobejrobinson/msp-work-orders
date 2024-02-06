'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import {Toaster, toast} from 'react-hot-toast'
export default function LogoutButton() {
  const router = useRouter()

  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient()

  const signOut = async () => {
    toast.loading('Logging out ...')
    await supabase.auth.signOut()
    toast.dismiss()
    toast.success('Logged Out!')
    router.refresh()
  }

  return (
    <>
      <Toaster />
      <button
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover bg-mainT20"
        onClick={signOut}
      >
        Logout
      </button>
    </>
  )
}
