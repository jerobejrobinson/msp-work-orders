import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import WorkOrderTable from "@/components/WorkOrderTable"
import BillingChart from "@/components/BIllingChart"
export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page() {
    const supabase = await createServerComponentClient({ cookies })

    const { data: workOrderData } = await supabase.from('work_order').select('id, number, type, tracking_number, product_number, return_shipping, created_at, last_update_at')
    const { data: billingData } = await supabase.from('billing').select('id, created_at, amount').order('created_at', { ascending: true})
    if(!workOrderData) {
        return (
            <div>
                <p>No Active Work Orders</p>
            </div>
        )
    }
    
    return (
        <div  className="h-main w-full bg-background flex flex-col items-center mt-16 space-y-8">
            {/* @ts-expect-error Server Component */}
            <WorkOrderTable data={workOrderData} admin={true}/>
        </div>
    )
}