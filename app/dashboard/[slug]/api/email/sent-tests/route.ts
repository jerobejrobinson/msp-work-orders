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

interface TestResult {
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
    const tId = searchParams.get('tId')
    
    // @ts-ignore
    const { data: wo, error: woError } = await supabase.from('work_order').select('id, number, customer ( email, first_name, last_name )').eq('id', id).limit(1).single<WorkOrder>()
    
    const { data: test, error: testError } = await supabase.from('test_result').select('note').eq('id', tId).limit(1).single<TestResult>()

    const { data: admin, error: adminError } = await supabase.from('admin').select('first_name, last_name').eq('id', an).limit(1).single<Admin>()

    if(woError) {
        console.log(woError)
        return NextResponse.json({status: 500, msg: "Could not retreive work order."})
    }
    if(testError) {
        return NextResponse.json({status: 500, msg: "Could not retreive note"})
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
                    "admin": `${admin.first_name} ${admin.last_name}`,
                    "note": test.note,
                    "number": wo.number,
                    "woUrl": `${process.env.NEXT_PUBLIC_URL}/work-orders/${wo.id}`,
                    "testUrl": test.link,
                    "customerName": wo.customer.first_name
                }
            }
        ],
        template_id: "d-cc15c6199f054d9595d058494c4be3f7"
    }

    // @ts-ignore
    await sgMail.send(msg)

    return NextResponse.json({status: 200})
}