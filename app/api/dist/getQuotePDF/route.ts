import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface Body {
    orderNumber: number;
}

export async function POST(request: Request) {
    // const supabase = await createRouteHandlerClient({ cookies })

    // const { data: users} = await supabase.auth.getUser()
    // const { error } = await supabase.from('admin').select().eq('user_id', users.user?.id).limit(1).single()

    // if(error) {
    //     return NextResponse.json({error: 'access not authorized'})
    // }

    const { orderNumber } : Body = await request.json()
    const cookieList = cookies()
    const token = cookieList.get('dist')

    if(!token) {
        return NextResponse.json({error: 'error getting token'})
    }

    const data = await fetch(`https://mingle-ionapi.inforcloudsuite.com/D7NMH8MYY885DBPS_TRN/IDM/api/items/search/item/resource?%24query=%2FInvoice%5B%40Order_Number%3D%22${orderNumber}%22%5D`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `bearer ${token.value}`,
            'Charset': 'utf-8'
        }
    }).then(data => data.json())
   

    return NextResponse.json({status: 200, url: data.res.url})
}