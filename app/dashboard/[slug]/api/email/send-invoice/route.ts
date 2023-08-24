import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import sgMail from '@sendgrid/mail'

interface WorkOrder {
    id: string
    number: string
    tracking_number: string
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

interface Billing {
    id: string,
    link: string
}
export async function GET(request: Request) {
    sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY)
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const bId = searchParams.get('bId')
    
    const { data } = await supabase.auth.getUser()
    const { data: admin, error: adminError } = await supabase.from('admin').select('first_name, last_name').eq('user_id', data.user?.id).limit(1).single<Admin>()
    
    // @ts-ignore
    const { data: wo, error: woError } = await supabase.from('work_order').select('id, number, tracking_number, customer ( email, first_name, last_name )').eq('id', id).limit(1).single<WorkOrder>()
    const { data: billing, error: billingError } = await supabase.from('billing').select('id, link').eq('id', bId).limit(1).single<Billing>()

    if(woError) {
        console.log(woError)
        return NextResponse.json({status: 500, msg: "Could not retreive work order."})
    }
    if(billingError) {
        console.log(billingError)
        return NextResponse.json({status: 500, msg: "Could not retreive billing."})
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
                    "invoiceUrl": billing.link,
                    "customerName": wo.customer.first_name,
                }
            }
        ],
        template_id: "d-d0a31a025b2043728b47a248b0b4455a"
    }

    // @ts-ignore
    await sgMail.send(msg)

    return NextResponse.json({status: 200})
}