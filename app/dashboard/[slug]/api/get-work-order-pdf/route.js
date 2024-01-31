import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import WorkOrderForm from "@/components/WorkOrderForm"
import ReactPDF from '@react-pdf/renderer'

export async function GET(request) {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if(id) {
        console.log(`work route ${id}`)
    }
    
    // @ts-ignore
    const { data: wo, error: woError } = await supabase.from('work_order').select('id, product_number, number, customer (first_name, last_name, account_number, address, city, phone, state, zip)').eq('id', id).limit(1).single()

    const stream = await ReactPDF.renderToStream(<WorkOrderForm wo={wo} />)

    return new Response(stream)
}