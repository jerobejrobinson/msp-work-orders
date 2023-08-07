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

export async function GET(request: Request) {
    sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY)
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    // @ts-ignore
    const { data: wo, error: woError } = await supabase.from('work_order').select('id, number, type, customer ( email, first_name, last_name )').eq('id', id).limit(1).single<WorkOrder>()

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
                    "number": wo.number,
                    "type": wo.type,
                    "url": `${process.env.NEXT_PUBLIC_URL}/dashboard/${wo.id}`
                }
            }
        ],
        template_id: "d-cec482823e50491899c7028e34259b77"
    }

    // @ts-ignore
    await sgMail.send(adminMsg)

    return NextResponse.json({status: 200})
}