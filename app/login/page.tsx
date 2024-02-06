'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast'

export default function Login() {
  const searchParams = useSearchParams().get('sign-up')
  console.log(searchParams)
  const [view, setView] = useState(searchParams ? 'sign-up' : 'sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    setView('check-email')
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if(error) {
      toast.error(error.message)
      return;
    }

    const { data, error: userError } = await supabase.auth.getUser()
    const { data: aData, error: aError } = await supabase.from('admin').select().eq('user_id', data.user?.id).limit(1).single()

    if(aError && data) {
      router.push('/work-orders')
      router.refresh()
    }
    
    if(aData) {
      router.push('/dashboard')
      router.refresh()
    }


    
    
    // router.refresh()
  }

  return (
    <div className="h-screen w-full bg-background flex flex-col items-center justify-center relative">
      <Toaster/>
      
      {view === 'check-email' ? (
        <p className="text-center text-foreground">
          Check <span className="font-bold">{email}</span> to continue signing
          up
        </p>
      ) : (
        <form
          className="w-full text-foreground max-w-xl bg-white p-8"
          onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp}
        >
          <Image 
            src="/images/clear-logo.png"
            width={333}
            height={166}
            alt="MSP Diesel Solution Logo"
            className='mx-auto -translate-x-4'
          />
          <div className='flex-1 flex flex-col gap-2'>
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="you@example.com"
            />
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="••••••••"
            />
            {view === 'sign-in' && (
              <>
                <button className="bg-main rounded px-4 py-2 text-white mb-6">
                  Sign In
                </button>
                <p className="text-sm text-center">
                  Don't have an account?
                  <button
                    className="ml-1 p-4 bg-green-300 rounded text-white"
                    onClick={() => setView('sign-up')}
                  >
                    Sign Up Now
                  </button>
                </p>
              </>
            )}
            {view === 'sign-up' && (
              <>
                <button className="bg-green-300 rounded px-4 py-2 text-white mb-6">
                  Sign Up
                </button>
                <p className="text-sm text-center">
                  Already have an account?
                  <button
                    className="ml-1 p-4 bg-main rounded text-white"
                    onClick={() => setView('sign-in')}
                  >
                    Sign In Now
                  </button>
                </p>
              </>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
