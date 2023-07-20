import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
export default async function WorkOrderPage() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }
    const { data: customerData } = await supabase.from('customer').select('user_id, id').eq('user_id', user.id).limit(1).single()
    if(!customerData) {
        return (
            <div>
                <p>Your customer profile has not been set up please click the link below to continue.</p>
                <Link
                    href="/profile"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                >
                    Add Customer Profile
                </Link>
            </div>
        )
    }

    const { data: workOrderData } = await supabase.from('work_order').select().eq('customer_id', customerData.id)
    if(!workOrderData) {
        return (
            <div>
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
        <div className="min-h-screen w-full bg-background flex flex-col items-center">
            <div className="w-full max-w-7xl flex justify-between pt-8">
                <Link
                    href="/"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                >
                    Back
                </Link>
                <Link
                    href="/work-orders/create"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                >
                    Create New Work Order
                </Link>
            </div>
            <div className="w-full max-w-7xl flex flex-col gap-4 pt-8">
                {workOrderData.map(wo => (
                    <Link 
                        className="bg-white border rounded w-full grid grid-cols-2 p-4"
                        href={`/work-orders/${wo.id}`}
                        key={wo.id}
                    >
                        <div>{wo.number}</div>
                        <div>{wo.product_number}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}