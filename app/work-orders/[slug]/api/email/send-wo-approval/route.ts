import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import sgMail from '@sendgrid/mail'

interface WorkOrder {
    id: string
    number: string
    type: string
    customer: {
        email: string
        first_name: string
        last_name: string
    }
}

interface Billing {
    id: string
    approved: boolean
    invoice: string
    amount: number
    link: string
}

export async function GET(request: Request) {
    sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY)
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const bId = searchParams.get('bId')
    
    // @ts-ignore
    const { data: wo, error: woError } = await supabase.from('work_order').select('id, number, type, customer ( email, first_name, last_name )').eq('id', id).limit(1).single<WorkOrder>()

    // @ts-ignore
    const { data: billing, error: billingError } = await supabase.from('billing').select('approved, invoice').eq('id', bId).limit(1).single<Billing>()

    if(woError) {
        console.log(woError)
        return NextResponse.json({status: 500, msg: "Could not retreive work order."})
    }

    const adminMsg = {
        from: {
            email: "jrobinson@mspdieselsolutions.com"
        },
        personalizations: [
            {
                to: [
                    {
                        email: "jrobinson@mspdieselsolutions.com"
                    }
                ],
                dynamic_template_data: {
                    "customerName": `${wo.customer.first_name} ${wo.customer.last_name}`,
                    "approved": billing?.approved,
                    "number": wo.number,
                    "invoice": "10021345-00",
                    "woUrl": `${process.env.NEXT_PUBLIC_URL}/dashboard/${wo.id}`,
                    "iUrl": billing?.link
                }
            }
        ],
        template_id: "d-ef05517928ad4b6aa605c0835923cbab"
    }

    // @ts-ignore
    await sgMail.send(adminMsg)

    return NextResponse.json({status: 200})
}