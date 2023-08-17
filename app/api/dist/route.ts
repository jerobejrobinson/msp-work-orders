import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    // const cookieStore
    // const cred = await fetch(`${process.env.INFOR_API_pu}${process.env.INFOR_API_ot}`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: `grant_type=password&client_id=${process.env.INFOR_API_ci}&client_secret=${process.env.INFOR_API_cs}&username=${process.env.INFOR_APR_USER}&password=${process.env.INFOR_API_PASS}`
    // }).then(data => data.json())
    
    // let response = NextResponse.json({status: 200})
    // response.headers.append('Set-Cookie', `dist=${cred.access_token}; Max-Age=${cred.expires_in}; HttpOnly=true;`)
    
    // URL to redirect to after sign in process completes
    return NextResponse.json({name: 'dist', status: 200})
}