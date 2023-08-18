import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

interface Admin {
    id: string
}

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data } = await supabase.auth.getUser()
    const { data: admin, error: adminError } = await supabase.from('admin').select('id').eq('user_id', data.user?.id).limit(1).single<Admin>()
    const {id, type} = await request.json()
    
    // @ts-ignore
    const { error: logError } = await supabase.from('log').insert({admin_id: admin.id, wo_id: id, action: type})

    if(logError) {
        NextResponse.error()
    }

    return NextResponse.json({status: 200})
}