import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface Body {
    customerNumber: number;
}

export async function POST(request: Request) {
    const { customerNumber } : Body = await request.json()
    const cookieList = cookies()
    const token = cookieList.get('dist')

    if(!token) {
        return NextResponse.json({error: 'error getting token'})
    }

    const data = await fetch(`${process.env.INFOR_API_URL}/sxapiARGetCustomerData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token.value}`
        },
        body: JSON.stringify({
            request: {
                companyNumber: 3,
                operatorInit: "jjr",
                operatorPassword: "",
                customerNumber,
                requestType: 'general'
            }
        })
    }).then(data => data.json())
   
    return NextResponse.json({status: 200, data})
}