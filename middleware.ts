import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession()

  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    // const { data } = await supabase.auth.getUser()
    // const { error } = await supabase.from('admin').select().eq('user_id', data.user?.id).limit(1).single()

    // if(error) {
    //   return NextResponse.redirect(process.env.NEXT_PUBLIC_URL)
    // }
    
    let cookie = req.cookies.get('dist')

    if(!cookie) {
      const cred = await fetch(`${process.env.INFOR_API_pu}${process.env.INFOR_API_ot}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=password&client_id=${process.env.INFOR_API_ci}&client_secret=${process.env.INFOR_API_cs}&username=${process.env.INFOR_APR_USER}&password=${process.env.INFOR_API_PASS}`
      }).then(data => data.json())
      
      res.headers.append('Set-Cookie', `dist=${cred.access_token}; Max-Age=${cred.expires_in}; HttpOnly=true;`)
      // @ts-ignore
      res.cookies.set({
        name: 'dist',
        value: cred.access_token,
        httpOnly: true,
        maxAge: cred.expires_in
      })
      return res
    }
    
    return res
  }

  if (req.nextUrl.pathname.startsWith('/api/dist')) {
    const res = NextResponse.next()

    // const { data: users} = await supabase.auth.getUser()
    // const { error } = await supabase.from('admin').select().eq('user_id', users.user?.id).limit(1).single()

    // if(error) {
    //   return NextResponse.redirect(process.env.NEXT_PUBLIC_URL)
    // }
    // let cookie = req.cookies.get('dist')

    // if(!cookie) {
    //   const cred = await fetch(`${process.env.INFOR_API_pu}${process.env.INFOR_API_ot}`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: `grant_type=password&client_id=${process.env.INFOR_API_ci}&client_secret=${process.env.INFOR_API_cs}&username=${process.env.INFOR_APR_USER}&password=${process.env.INFOR_API_PASS}`
    //   }).then(data => data.json())
      
    //   res.headers.append('Set-Cookie', `dist=${cred.access_token}; Max-Age=${cred.expires_in}; HttpOnly=true;`)
    //   // @ts-ignore
    //   res.cookies.set({
    //     name: 'dist',
    //     value: cred.access_token,
    //     httpOnly: true,
    //     maxAge: cred.expires_in
    //   })
    //   return res
    // }

    return res
    
  }
}

