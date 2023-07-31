import { createServerComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import Link from "next/link";

interface WorkOrder {
    id: string, 
    number: string, 
    type: string, 
    tracking_number: string, 
    product_number: string, 
    return_shipping: string, 
    created_at: Date, 
    last_update_at: Date
}

export default async function WorkOrderTable({ data, admin }: { data: [WorkOrder], admin: boolean}) {
    const supabase = createServerComponentClient({ cookies })

    const plusAddWorkOrderStatus = data.map(async (wo) => {
        const { data: billing, error } = await supabase.from('billing').select('id, approved').eq('wo_id', wo.id).limit(1).single()

        if(wo.tracking_number) {
            return {...wo, status: 'shipped'}
        }

        if(wo.type !== 'test only') {
            if(billing) {
                if(billing.approved) {
                    return { ...wo, status: `Work in progress` }
                }else {
                    return { ...wo, status: 'Billing sent - waiting for approval' }
                }
            }
        }

        if(wo.type === 'test only') {
            if(billing) {
                return {...wo, status: 'Billing sent - waiting to be shipped'}
            }
        }

        const { data: test_results }= await supabase.from('test_result').select(`id`).eq('wo_id', wo.id)

        if(test_results?.length) {
            return {...wo, status: 'Tested'}
        }

        if(wo.number !== 'pending') {
            return {...wo, status: 'recieved'}
        }

        if(wo.return_shipping) {
            return {...wo, status: 'Shipping label submitted'}
        }

        return {...wo, status: 'Work order submitted'}
    })

    const woData = await Promise.all(plusAddWorkOrderStatus)

    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center mt-16 space-y-8">
            <div className="w-full max-w-7xl flex justify-between pt-8">
                <Link
                    href="/"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                >
                    Back
                </Link>
                {!admin && (
                    <Link
                        href="/work-orders/create"
                        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-mainT20 hover:text-white flex flex-row items-center"
                    >
                        Create New Work Order
                    </Link>
                )}
            </div>
            <div className="w-full max-w-7xl flex flex-col bg-white border rounded">
                <div className="w-full grid grid-cols-5 p-4 bg-gray-300">
                    <div>Work Order Number</div>
                    <div>Product Number</div>
                    <div>Status</div>
                    <div>Date Submitted</div>
                    <div>Last Updated</div>
                </div>
                {woData.map(wo => (
                    <Link 
                        className="bg-white border w-full grid grid-cols-5 p-4 hover:bg-main hover:text-white"
                        href={`/work-orders/${wo.id}`}
                        key={wo.id}
                    >
                        <div>{wo.number}</div>
                        <div>{wo.product_number}</div>
                        <div>{wo.status}</div>
                        <div>{new Date(wo.created_at).toLocaleString()}</div>
                        <div>{new Date(wo.last_update_at).toLocaleString()}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}