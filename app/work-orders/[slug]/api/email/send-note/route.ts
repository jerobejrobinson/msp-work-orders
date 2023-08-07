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
export async function GET(request: Request) {
    sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY)
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const nId = searchParams.get('nId')
    
    // @ts-ignore
    const { data: wo, error: woError } = await supabase.from('work_order').select('id, number, customer ( email, first_name, last_name )').eq('id', id).limit(1).single<WorkOrder>()
    
    const { data: note, error: noteError } = await supabase.from('note').select('note').eq('id', nId).limit(1).single<Note>()

    if(woError) {
        console.log(woError)
        return NextResponse.json({status: 500, msg: "Could not retreive work order."})
    }
    if(noteError) {
        console.log(noteError)
        return NextResponse.json({status: 500, msg: "Could not retreive note"})
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
                    "woNumber": wo.number,
                    "note": note.note,
                    "url": `${process.env.NEXT_PUBLIC_URL}/dashboard/${wo.id}`
                }
            }
        ],
        template_id: "d-532ca9c3ebfc49418d56c5d9d803159f"
    }

    // @ts-ignore
    await sgMail.send(adminMsg)

    return NextResponse.json({status: 200})
}