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

interface Note {
    id: string,
    note: string
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
    const nId = searchParams.get('nId')
    
    console.log(id, an, nId)
    // @ts-ignore
    const { data: wo, error: woError } = await supabase.from('work_order').select('id, number, customer ( email, first_name, last_name )').eq('id', id).limit(1).single<WorkOrder>()
    
    const { data: note, error: noteError } = await supabase.from('note').select('note').eq('id', nId).limit(1).single<Note>()

    const { data: admin, error: adminError } = await supabase.from('admin').select('first_name, last_name').eq('id', an).limit(1).single<Admin>()

    if(woError) {
        console.log(woError)
        return NextResponse.json({status: 500, msg: "Could not retreive work order."})
    }
    if(noteError) {
        console.log(noteError)
        return NextResponse.json({status: 500, msg: "Could not retreive note"})
    }
    if(adminError) {
        console.log(noteError)
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
                    "note": note.note,
                    "number": wo.number,
                    "url": `${process.env.NEXT_PUBLIC_URL}/work-orders/${wo.id}`
                }
            }
        ],
        template_id: "d-8c130dc8c36548a7a94224db4d9f3cab"
    }

    // @ts-ignore
    await sgMail.send(msg)

    return NextResponse.json({status: 200})
}