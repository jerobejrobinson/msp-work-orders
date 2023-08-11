import WorkOrderTable from "@/components/WorkOrderTable"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"

export const revalidate = 0

export default async function WorkOrderPage() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }
    const { data: customerData } = await supabase.from('customer').select('user_id, id').eq('user_id', user.id).limit(1).single()

    if(!customerData) {
       notFound()
    }

    const { data: workOrderData } = await supabase.from('work_order').select('id, number, type, tracking_number, product_number, return_shipping, created_at, last_update_at').eq('customer_id', customerData.id).order('last_update_at', { ascending: false })

    if(!workOrderData) {
        return (
            <div className="min-h-main mt-16">
                <p>No Active Work Orders</p>
                <Link
                    href="/work-orders/create"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                >
                    Click here to create new work order
                </Link>
            </div>
        )
    }

    return (
        <>
            {/* @ts-expect-error Server Component */}
            <WorkOrderTable data={workOrderData} admin={false}/>
        </>
    )
}