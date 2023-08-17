import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface Body {
    customerNumber: number,
    orderNumber: number,
    orderSuffix: number
}

export async function POST(request: Request) {
    const { customerNumber, orderNumber, orderSuffix } : Body = await request.json()
    const cookieList = cookies()
    const token = cookieList.get('dist')

    if(!token) {
        return NextResponse.json({error: 'error getting token'})
    }

    const data = await fetch(`${process.env.INFOR_API_URL}/sxapiSFGetOEOrderData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token.value}`
        },
        body: JSON.stringify({
            request: {
                companyNumber: 3,
                operatorInit: "sys",
                operatorPassword: "",
                getOrderInfo: 'Y',
                customerNumber,
                orderNumber,
                orderSuffix
            }
        })
    }).then(data => data.json())
   
    return NextResponse.json({status: 200, amount: data.response.tOrderhdrtrans['t-orderhdrtrans'][0].totordamt})
}