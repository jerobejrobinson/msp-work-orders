import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import WorkOrderTable from "@/components/WorkOrderTable"

export const revalidate = 0

export default async function Page() {
    const supabase = await createServerComponentClient({ cookies })

    const { data: { user } } = await supabase.auth.getUser()

    const { data: admin  } = await supabase.from('admin').select('user_id').eq('user_id', user?.id).limit(1).single()

    if(!admin) {
        redirect('/')
    }

    const { data: workOrderData } = await supabase.from('work_order').select('id, number, type, tracking_number, product_number, return_shipping, created_at, last_update_at')

    if(!workOrderData) {
        return (
            <div>
                <p>No Active Work Orders</p>
            </div>
        )
    }
    return (
        <>
            {/* @ts-expect-error Server Component */}
            <WorkOrderTable data={workOrderData} admin={true}/>
        </>
    )
}