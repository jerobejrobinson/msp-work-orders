import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
export default async function Page() {
    const supabase = await createServerComponentClient({ cookies })

    const { data: { user } } = await supabase.auth.getUser()

    const { data: admin  } = await supabase.from('admin').select('user_id').eq('user_id', user?.id).limit(1).single()

    if(!admin) {
        redirect('/')
    }

    const { data: workOrderData } = await supabase.from('work_order').select()
    if(!workOrderData) {
        return (
            <div>
                <p>No Active Work Orders</p>
            </div>
        )
    }
    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center mt-16">
            <div className="w-full max-w-7xl flex justify-between pt-8">
                
                
            </div>
            <div className="w-full max-w-7xl flex flex-col gap-4 pt-8">
                {workOrderData.map(wo => (
                    <Link 
                        className="bg-white border rounded w-full grid grid-cols-2 p-4"
                        href={`/dashboard/${wo.id}`}
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