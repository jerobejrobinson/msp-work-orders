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
    id: string,
    note: string,
    link: string
}

interface Admin {
    id: string
    first_name: string
    last_name: string
}

export async function GET(request: Request) {
    sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY)
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const an = searchParams.get('an')
    const bId = searchParams.get('tId')
    
    // @ts-ignore
    const { data: wo, error: woError } = await supabase.from('work_order').select('id, number, type, customer ( email, first_name, last_name )').eq('id', id).limit(1).single<WorkOrder>()
    
    const { data: billing, error: billingError } = await supabase.from('billing').select('note').eq('id', bId).limit(1).single<Billing>()

    const { data: admin, error: adminError } = await supabase.from('admin').select('first_name, last_name').eq('id', an).limit(1).single<Admin>()

    if(woError) {
        console.log(woError)
        return NextResponse.json({status: 500, msg: "Could not retreive work order."})
    }
    if(billingError) {
        return NextResponse.json({status: 500, msg: "Could not retreive billing"})
    }
    if(adminError) {
        console.log(adminError)
        return NextResponse.json({status: 500, msg: "error retreiving a"})
    }

    const msg = {
        from: {
            email: "jrobinson@mspdieselsolutions.com"
        },
        personalizations: [
            {
                to: [
                    {
                        email: wo.customer.email
                    }
                ],
                dynamic_template_data: {
                    "admin": `${admin.first_name}`,
                    "number": wo.number,
                    "woUrl": `${process.env.NEXT_PUBLIC_URL}/work-orders/${wo.id}`,
                    "billingUrl": billing.link,
                    "customerName": wo.customer.first_name,
                    "type": wo.type
                }
            }
        ],
        template_id: "d-fbd226e116de49e1afec11ef8768407d"
    }

    // @ts-ignore
    await sgMail.send(msg).then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
        
      })
      .catch((error) => {
        console.error(error)
      })

    return NextResponse.json({status: 200})
}