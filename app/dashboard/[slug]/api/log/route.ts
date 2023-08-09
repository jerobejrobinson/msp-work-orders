import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const {id, aId, type} = await request.json()
    
    // @ts-ignore
    const { error: logError } = await supabase.from('log').insert({admin_id: aId, wo_id: id, action: type})

    if(logError) {
        NextResponse.error()
    }

    return NextResponse.json({status: 200})
}