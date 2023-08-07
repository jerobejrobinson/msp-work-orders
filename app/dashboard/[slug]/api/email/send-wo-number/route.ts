import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import sgMail from '@sendgrid/mail'

interface WorkOrder {
    id: string
    number: string
    customer: {
        email: string
        first_name: string
        last_name: string
    }
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
    
    // @ts-ignore
    const { data: wo, error: woError } = await supabase.from('work_order').select('id, number, customer ( email, first_name, last_name )').eq('id', id).limit(1).single<WorkOrder>()

    const { data: admin, error: adminError } = await supabase.from('admin').select('first_name, last_name').eq('id', an).limit(1).single<Admin>()

    if(woError) {
        console.log(woError)
        return NextResponse.json({status: 500, msg: "Could not retreive work order."})
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
                    "customerName": wo.customer.first_name,
                    "url": `${process.env.NEXT_PUBLIC_URL}/work-orders/${wo.id}`
                }
            }
        ],
        template_id: "d-2dad51c0bcd845918afb498756917ea0"
    }

    // @ts-ignore
    await sgMail.send(msg)

    return NextResponse.json({status: 200})
}