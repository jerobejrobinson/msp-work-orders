import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import sgMail from '@sendgrid/mail'

interface WorkOrder {
    id: string
    type: string
    product_number: string
    quanity: string
    carrier: string
    shipping: string
    details: string
    part_issues: [string]
    customer: {
        email: string
        first_name: string
        last_name: string
        address: string
        address_2: string | null
        phone: number
        state: string
        city: string
        zip: number
        account_number: number | null
        company_name: string | null
        country: string
    }
}

export async function GET(request: Request) {
    sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY)
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    // @ts-ignore
    const { data, error } = await supabase.from('work_order').select('id, type, product_number, quanity, carrier, shipping, details, part_issue, customer ( email, first_name, last_name, address, address_2, phone, state, city, zip, country, account_number, company_name,  )').eq('id', id).limit(1).single<WorkOrder>()

    if(error) {
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
                        email: data.customer.email
                    }
                ],
                dynamic_template_data: {
                    "name": data.customer.first_name + " " + data.customer.last_name,
                    "phone": data.customer.phone,
                    "address": data.customer.address,
                    "address_2": data.customer.address_2,
                    "city": data.customer.city,
                    "state": data.customer.state,
                    "zip": data.customer.zip,
                    "country": data.customer.country,
                    "account_number": data.customer.account_number,
                    "company_name": data.customer.company_name,
                    "product_number": data.product_number,
                    "quanity": data.quanity,
                    "type": data.type,
                    "details": data.details,
                    "part_issue": data.part_issues,
                    "carrier": data.carrier,
                    "shipping": data.shipping,
                    "url": `${process.env.NEXT_PUBLIC_URL}/dashboard/${data.id}`
                }
            }
        ],
        template_id: "d-a6098a4536f74c5fa7dcb5443c487296"
    }

    const customerMsg = {
        from: {
            email: 'jrobinson@mspdieselsolutions.com'
        },
        personalizations: [
            {
                to: [
                    {
                        email: data.customer.email,
                    }
                ],
                dynamic_template_data: {
                    "name": 'jerobe',
                    "packingSlipURL": `${process.env.NEXT_PUBLIC_URL}/assets/mspShippingDoc.pdf`
                }
            }
        ],
        template_id: "d-f354dc9138c545e89e38f3ec4fccd907"
    }

    // @ts-ignore
    await sgMail.send(customerMsg)

    // @ts-ignore
    await sgMail.send(adminMsg)

    return NextResponse.json({status: 200})
}